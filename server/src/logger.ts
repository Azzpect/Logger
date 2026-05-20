import type { Message } from "./types.js";
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { readStream } from "./redis.js";

export const recordSep = String.fromCharCode(30);
export const lineSep = String.fromCharCode(31);
export const logPath = path.join(import.meta.dirname, "./logs")

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
  const formattedDate = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}\t${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
  const filepath = path.join(logPath, `./${`${date.getDate()}`.padStart(2, "0")}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${date.getFullYear()}.log`);
  const text = `${message.service}${recordSep}${message.level}${recordSep}${formattedDate}${recordSep}${message.message}${lineSep}`
  appendFileSync(filepath, text, "utf8")
}


export { logger }
