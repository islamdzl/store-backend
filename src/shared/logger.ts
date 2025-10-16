import pino from "pino";
import fs from "fs";
import path from "path";



const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const isDev = process.env.NODE_ENV !== "production";

const transport = isDev
  ? {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    }
  : undefined;

const logStream = fs.createWriteStream(path.join(logDir, "app.log"), {
  flags: "a",
});

const logger = pino(
  {
    level: "info",
    transport,
  },
  isDev ? process.stdout : logStream
);

export default logger;
