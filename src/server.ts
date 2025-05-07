import express, {Express, Request, Response} from "express";
import { config } from "./config/config";
import { PublisherService } from "./app/publisher/PublisherService";
import { Message } from "./interfaces/Message";


const app: Express = express();
app.use(express.json());

const publisher = new PublisherService();

app.get("/", async(req: Request, res: Response) => {
  res.send("Hello!")
})
app.post("/publish", async(req: Request, res: Response) => {
  const { sender, content } = req.body;

   if (!sender || !content) {
    res.status(400).json({ error: "Missing sender or content" });
    return;
  }

  const message: Message = {
    sender,
    content,
    timestamp: new Date().toISOString(),
  }

  const id = await publisher.publish(message);
  res.json({ status: "published", id });
});


app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} 🎉`)
})