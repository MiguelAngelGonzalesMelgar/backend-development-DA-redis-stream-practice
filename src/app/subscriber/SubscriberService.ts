import redis from "../../config/redisClient"

type StreamEntry = [string, string[]];
type StreamData = [string, StreamEntry[]];
type RedisStreamResponse = StreamData[];   

export class SubscriberService {
  private streamKey = process.env.STREAM_KEY || "messages";
  private groupName = "subscribers-group";
  private consumerName: string;

  constructor(name: string) {
    this.consumerName = name;
    this.setupConsumerGroup();
  }

  private async setupConsumerGroup() {
    try {
      await redis.xgroup("CREATE", this.streamKey, this.groupName, "0", "MKSTREAM");
      console.log(`[${this.consumerName}] Created consumer group`);
    } catch (error: any) {
      if (error.message.includes("BUSYGROUP")) {
        console.log(`[${this.consumerName}] Group already exists.`);
      } else {
        console.error("Error creating consumer group:", error);
      }
    }
  }

  async listen() {
    console.log(`[${this.consumerName}] Listening for messages...`);
    while (true) {
      const response = await redis.call(
        "XREADGROUP",
        "GROUP",
        this.groupName,
        this.consumerName,
        "BLOCK", 5000,
        "COUNT", 10,
        "STREAMS",
        this.streamKey,
        '>'
      ) as RedisStreamResponse | null;

      if (response && response.length > 0) {
        const [streamName, entries] = response[0];
        for (const [id, fields] of entries) {
          const message = {
            sender: fields[1],
            content: fields[3],
            timestamp: fields[5],
          };
          console.log(`[${this.consumerName}] Received:`, message);
          await redis.xack(this.streamKey, this.groupName, id); // Acknowledge
        }
      }
    }
  }
}