import { PrismaService } from "../infrastructure/database/prisma.service"
import { RabbitMQService } from "../infrastructure/messaging/rabbitmq.service"
import { AuthEventSubscriber } from "../infrastructure/messaging/subscribers/auth-event.subscriber"

export const bootstrap = async (): Promise<void> => {
  try {
    const prisma = PrismaService.getInstance()
    await prisma.$connect()
    console.log("[Bootstrap] Database connected successfully")

    const rabbitmq = RabbitMQService.getInstance()
    await rabbitmq.connect()

    const authEventSubscriber = new AuthEventSubscriber()
    await authEventSubscriber.subscribe()
  } catch (error) {
    console.error("[Bootstrap] Failed to initialize services:", error)
    throw error
  }
}

export const shutdown = async (): Promise<void> => {
  try {
    await PrismaService.disconnect()
    await RabbitMQService.getInstance().disconnect()
    console.log("[Shutdown] Services disconnected successfully")
  } catch (error) {
    console.error("[Shutdown] Error during shutdown:", error)
  }
}
