import express from "express";
import { connectToRedis } from "./redis.js";
import { logger } from "./logger.js";
import path from "node:path";
import { readdirSync } from "node:fs";


const app = express();
const port = process.env.PORT;
const __dirname = import.meta.dirname;
const logPath = path.join(__dirname, "./logs")

await connectToRedis();
logger();



app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "../views/public")))

app.get("/", (req, res) => {
  const fileList = readdirSync(logPath);
  res.render("index", { title: "New Page", fileList, serviceList: ["CMS", "USER", "DEMO"], levelList: ["INFO", "ERROR", "WARN"] })
})

app.listen(port, () => {
  console.log("Server is running on http://127.0.0.1:"+port);
})
