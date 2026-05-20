import { createClient } from "redis"
import type { RedisResponse } from "./types.js";

const host = process.env.REDIS_HOST
const port = process.env.REDIS_PORT
const streamName = process.env.LOGSTREAM;
let lastLogId: string | null;

const redisClient = createClient({
  url: `redis://${host}:${port}`
})


async function connectToRedis() {
  redisClient.on("error", err => {
    console.log("Redis error: ", err);
  })
  await redisClient.connect();
  console.log("Connected to Redis");
  lastLogId = await redisClient.get("last_log_id");
}


async function readStream() {
  let data: any;
  if (lastLogId) {
    data = await redisClient.xRead(
      [{ key: streamName, id: lastLogId }],
      { COUNT: 5 }
    )
  } else {
    data = await redisClient.xRead(
      [{ key: streamName, id: "$" }],
      { BLOCK: 0 }
    )
  }
  const messages: RedisResponse[] = data?.[0]?.messages || [];
  const id = messages[messages.length - 1]?.id
  if (id) {
    await redisClient.set("last_log_id", id);
    lastLogId = id;
  }
  return messages;
}

export { connectToRedis, readStream }
