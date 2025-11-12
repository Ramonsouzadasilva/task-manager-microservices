import { RabbitMQService, type MessagePayload } from "../rabbitmq.service"

export class AuthEventSubscriber {
  private readonly rabbitmq: RabbitMQService

  constructor() {
    this.rabbitmq = RabbitMQService.getInstance()
  }

  async subscribe(): Promise<void> {
    await this.rabbitmq.subscribe(
      "auth.events",
      "user.registered",
      "task-service.user-registered",
      this.handleUserRegistered,
    )

    await this.rabbitmq.subscribe("auth.events", "user.deleted", "task-service.user-deleted", this.handleUserDeleted)
  }

  private handleUserRegistered = async (message: MessagePayload): Promise<void> => {
    console.log("[AuthEventSubscriber] User registered:", message.data)
  }

  private handleUserDeleted = async (message: MessagePayload): Promise<void> => {
    console.log("[AuthEventSubscriber] User deleted:", message.data)
  }
}
