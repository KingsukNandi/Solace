import pino from "pino";

let logger;

if (typeof window === "undefined") {
  // Server-side logging
  const fs = require("fs");
  const logStream = fs.createWriteStream("./logs/app.log", { flags: "a" }); // 'a' for appending

  logger = pino({
    level: "info",
    transport: process.env.NODE_ENV === 'development' ? {
      target: "pino-pretty", // For pretty-printing logs in development
      options: {
        colorize: true,
      },
    } : undefined, // No transport in production
    timestamp: pino.stdTimeFunctions.isoTime,
  }, logStream);
} else {
  // Client-side logging
  logger = pino({
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  });
}

// Export the logger
export default logger;
