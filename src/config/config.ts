import dotenv from "dotenv";

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment varibale: ${key}`);
  return value;
}

export const config = {
  port: parseInt(requireEnv("PORT")),
  startSubscribers: process.env.START_SUBSCRIBERS === "true",
  redisUrl: requireEnv("REDIS_URL"),
};