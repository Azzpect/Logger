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


app.use("/", express.static(path.join(__dirname, "./web")))
app.use(cors({
  origin: "*"
}))


app.get("/api/get-files", (req, res) => {
  const fileList = readdirSync(logPath);
  res.json({fileList})
})

app.get("/api/get-file", (req, res) => {
  const logFile = req.query["file"];
  if (typeof logFile !== 'string') return res.status(400).json({msg: "invalid logFile"})
  const filePath = path.join(logPath, logFile);
  if (!existsSync(filePath)) {
    return res.status(400).json({msg: "not found"});
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

app.use((req, res) => {
  res.redirect("/200.html")
})

app.listen(port, () => {
  console.log("Server is running on http://127.0.0.1:"+port);
})
