import express from "express";
import { connectToRedis } from "./redis.js";
import { logger, logPath, recordSep, lineSep } from "./logger.js";
import path from "node:path";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import cors from "cors";


const app = express();
const port = process.env.PORT;
const __dirname = import.meta.dirname;

await connectToRedis();
logger();


app.use("/public", express.static(path.join(__dirname, "../web/public")))
app.use(cors({
  origin: ["http://localhost", "http://localhost:5173"]
}))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../web/index.html"));
})

app.get("/get-files", (req, res) => {
  const fileList = readdirSync(logPath);
  res.json({fileList})
})

app.get("/:logfile", (req, res) => {
  const logFile = req.params["logfile"];
  const filePath = path.join(logPath, logFile);
  if (!existsSync(filePath)) {
    return res.status(400).send("not found");
  }
  const content = readFileSync(filePath, { encoding: 'utf8' });
  const logs = content.split(lineSep).filter(line => line !== "").map(line => line.split(recordSep));
  let logObj: {[key: string]: { [key: string] : string[][] }} = {};

  logs.forEach((log: string[]) => {
    if (log.length < 4) return
    const service = log[0]?.toUpperCase();
    if (!service) return;
    let obj: { [key: string] : string[][] } = {}
    if (logObj[service]) {
      obj = {...logObj[service]};
    }
    const level = log[1]?.toUpperCase();
    if (!level) return;

    let logList: string[][] = [];
    if (obj[level]) {
      logList = [...obj[level]];
    }
    
    logList.push([log[2] || "", log[3] || ""])
    obj[level] = logList;
    logObj[service] = obj;
  })
  res.json({logs: logObj})
})

app.listen(port, () => {
  console.log("Server is running on http://127.0.0.1:"+port);
})
