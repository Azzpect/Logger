import EventEmitter from "node:events";
import type { Message, RedisResponse } from "./types.js";
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const logger = new EventEmitter();
const sep = String.fromCharCode(30);
const logPath = path.join(import.meta.dirname, "./logs")

if (!existsSync(logPath))
  mkdirSync(logPath)


logger.on("log", (data: RedisResponse[]) => {
  data.forEach(entry => {
    log(entry.message)
  })
})

async function log(message: Message) {
  const date = new Date(parseInt(message.timestamp));
  const formattedDate = `${`${date.getDate()}`.padStart(2, "0")}-${`${date.getMonth()+1}`.padStart(2, "0")}-${date.getFullYear()}`
  const filepath = path.join(logPath,`./${formattedDate}.log`);
  const text = `${message.level}${sep}${formattedDate}${sep}${message.service}${sep}${message.message}\n`
  appendFileSync(filepath, text, "utf8")
}


export default logger
