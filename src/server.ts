import express, {Express, Request, Response} from "express";
import { config } from "./config/config";
import { PublisherService } from "./app/publisher/PublisherService";
import { Message } from "./interfaces/Message";
import { SubscriberService } from "./app/subscriber/SubscriberService";

const app: Express = express();
app.use(express.json());

const publisher = new PublisherService();

app.post("/publish", async(req: Request, res: Response) => {
  const { sender, content } = req.body;

  const message: Message = {
    sender,
    content,
    timestamp: new Date().toISOString(),
  }

  const id = await publisher.publish(message);
  res.json({ status: "published", id });
});

if (config.startSubscribers) {
  new SubscriberService("subscriber-1").listen();
  new SubscriberService("subscriber-2").listen();
  new SubscriberService("subscriber-3").listen();

}

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} 🎉`)
})