import { RabbitMQService } from "../rabbitmq.service"
import {
  UserEvent,
  type UserRegisteredPayload,
  type UserLoggedInPayload,
  type UserLoggedOutPayload,
} from "../events/user-events"

export class UserEventPublisher {
  private readonly rabbitmq: RabbitMQService
  private readonly exchange = "auth.events"

  constructor() {
    this.rabbitmq = RabbitMQService.getInstance()
  }

  async publishUserRegistered(payload: UserRegisteredPayload): Promise<void> {
    await this.rabbitmq.publish(this.exchange, UserEvent.USER_REGISTERED, {
      event: UserEvent.USER_REGISTERED,
      data: payload,
      timestamp: new Date(),
    })
  }

  async publishUserLoggedIn(payload: UserLoggedInPayload): Promise<void> {
    await this.rabbitmq.publish(this.exchange, UserEvent.USER_LOGGED_IN, {
      event: UserEvent.USER_LOGGED_IN,
      data: payload,
      timestamp: new Date(),
    })
  }

  async publishUserLoggedOut(payload: UserLoggedOutPayload): Promise<void> {
    await this.rabbitmq.publish(this.exchange, UserEvent.USER_LOGGED_OUT, {
      event: UserEvent.USER_LOGGED_OUT,
      data: payload,
      timestamp: new Date(),
    })
  }
}
