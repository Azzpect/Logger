import logger from "./logger.js";
import { connectToRedis, readStream } from "./redis.js";



await connectToRedis();


while (true) {
  const data = await readStream();
  if (data.length === 0) {
    continue;
  }
  logger.emit("log", data);
}
