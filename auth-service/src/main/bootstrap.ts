import { PrismaService } from '../infrastructure/database/prisma.service';
import { RedisCacheService } from '../infrastructure/services/redis-cache.service';
import { RabbitMQService } from '../infrastructure/messaging/rabbitmq.service';

export const bootstrap = async (): Promise<void> => {
  try {
    const prisma = PrismaService.getInstance();
    await prisma.$connect();

    const rabbitmq = RabbitMQService.getInstance();
    await rabbitmq.connect();
  } catch (error) {
    console.error('[Bootstrap] Failed to initialize services:', error);
    throw error;
  }
};

export const shutdown = async (): Promise<void> => {
  try {
    await PrismaService.disconnect();
    await RedisCacheService.disconnect();
    await RabbitMQService.getInstance().disconnect();
  } catch (error) {
    console.error('[Shutdown] Error during shutdown:', error);
  }
};
