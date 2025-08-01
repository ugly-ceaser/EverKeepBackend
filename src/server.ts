// src/server.ts

import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectToDatabase, disconnectFromDatabase } from './config/database';

const startServer = async (): Promise<void> => {
  try {
    // Connect to DB
    await connectToDatabase();

    // Start Express server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      logger.info(`📘 API Docs: http://localhost:${env.PORT}/api-docs`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`📴 Received ${signal}, shutting down gracefully`);
      server.close(async () => {
        await disconnectFromDatabase();
        logger.info('👋 Process terminated');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
