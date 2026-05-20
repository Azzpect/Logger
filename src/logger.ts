import type { Message } from "./types.js";
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { readStream } from "./redis.js";

const sep = String.fromCharCode(30);
const logPath = path.join(import.meta.dirname, "./logs")

async function logger() {
  if (!existsSync(logPath))
    mkdirSync(logPath)

  while (true) {
    const data = await readStream();
    if (data.length === 0) {
      continue;
    }
    data.forEach(entry => {
      log(entry.message)
    })
  }
}

async function log(message: Message) {
  const date = new Date(parseInt(message.timestamp));
  const formattedDate = `${`${date.getDate()}`.padStart(2, "0")}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${date.getFullYear()}`
  const filepath = path.join(logPath, `./${formattedDate}.log`);
  const text = `${message.service}${sep}${message.level}${sep}${formattedDate}${sep}${message.message}\n`
  appendFileSync(filepath, text, "utf8")
}


export { logger }
