// src/config/database.ts

import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Failed to connect to the database:', error);
    process.exit(1);
  }
};

export const disconnectFromDatabase = async () => {
  try {
    await prisma.$disconnect();
    logger.info('🔌 Database connection closed');
  } catch (error) {
    logger.warn('⚠️ Error while disconnecting from the database:', error);
  }
};

export { prisma };
