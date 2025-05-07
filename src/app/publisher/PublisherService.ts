import redis from "../../config/redisClient";
import { Message } from "../../interfaces/Message";

export class PublisherService {
  private streamKey: string;

  constructor() {
    this.streamKey = process.env.STREAM_KEY ?? "messages";
  }
  async publish(message: Message): Promise<string> {
    const entryId = await redis.xadd(
      this.streamKey,
      '*', // let Redis assign the id
      "sender", message.sender,
      "content", message.content,
      "timestamp", message.timestamp
    );
    console.log(`Published message with ID ${entryId}`);
    return entryId as string;
  }
}