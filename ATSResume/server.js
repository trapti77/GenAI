import { connectDB } from "./src/config/database.js";

const PORT = process.env.PORT || 5000;

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            logger.info('server running on http://localhost:5000');
             logger.info(
               `📝 Environment: ${process.env.NODE_ENV || "development"}`,
             );
        })
        process.on('SIGTERM', () => {
           logger.info("SIGTERM received. Closing server...");
           server.close(() => {
             logger.info("Server closed");
             process.exit(0);
           });
        })
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
