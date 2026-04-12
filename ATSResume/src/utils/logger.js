import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// recreate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, "../../logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

console.log("Logs directory:", logsDir);

// Log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const colors = {
  error: "\x1b[31m", // Red
  warn: "\x1b[33m", // Yellow
  info: "\x1b[36m", // Cyan
  debug: "\x1b[35m", // Magenta
};

class Logger {
  constructor() {
    this.currentLogFile = this.getLogFileName();
  }

  getLogFileName() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return path.join(logsDir, `${year}-${month}-${day}.log`);
  }

  formatMessage(level, message, meta = null) {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (meta) {
      logMessage += `\n${JSON.stringify(meta, null, 2)}`;
    }

    return logMessage;
  }

  writeToFile(message) {
    try {
      // Check if we need to create a new log file (new day)
      const newLogFile = this.getLogFileName();
      if (newLogFile !== this.currentLogFile) {
        this.currentLogFile = newLogFile;
      }

      fs.appendFileSync(this.currentLogFile, message + "\n");
    } catch (error) {
      console.error("Failed to write to log file:", error);
    }
  }

  log(level, message, meta = null) {
    const formattedMessage = this.formatMessage(level, message, meta);

    // Console logging with colors
    if (process.env.NODE_ENV !== "production" || level === "error") {
      const color = colors[level] || "\x1b[0m";
      console.log(`${color}${formattedMessage}\x1b[0m`);
    }

    // File logging (always in production, optional in development)
    if (
      process.env.NODE_ENV === "production" ||
      process.env.LOG_TO_FILE === "true"
    ) {
      this.writeToFile(formattedMessage);
    }
  }

  error(message, meta = null) {
    this.log("error", message, meta);
  }

  warn(message, meta = null) {
    this.log("warn", message, meta);
  }

  info(message, meta = null) {
    this.log("info", message, meta);
  }

  debug(message, meta = null) {
    if (process.env.NODE_ENV === "development") {
      this.log("debug", message, meta);
    }
  }
}

const logger = new Logger();
export default logger;
