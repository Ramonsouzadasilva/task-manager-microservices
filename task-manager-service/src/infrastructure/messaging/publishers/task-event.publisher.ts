import { RabbitMQService } from "../rabbitmq.service"
import { TaskEvent, type TaskCreatedPayload, type TaskCompletedPayload } from "../events/task-events"

export class TaskEventPublisher {
  private readonly rabbitmq: RabbitMQService
  private readonly exchange = "task.events"

  constructor() {
    this.rabbitmq = RabbitMQService.getInstance()
  }

  async publishTaskCreated(payload: TaskCreatedPayload): Promise<void> {
    await this.rabbitmq.publish(this.exchange, TaskEvent.TASK_CREATED, {
      event: TaskEvent.TASK_CREATED,
      data: payload,
      timestamp: new Date(),
    })
  }

  async publishTaskCompleted(payload: TaskCompletedPayload): Promise<void> {
    await this.rabbitmq.publish(this.exchange, TaskEvent.TASK_COMPLETED, {
      event: TaskEvent.TASK_COMPLETED,
      data: payload,
      timestamp: new Date(),
    })
  }
}
