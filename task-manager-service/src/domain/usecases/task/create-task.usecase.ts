import type { ITaskRepository } from "../../repositories/task.repository"
import type { CreateTaskData, TaskEntity } from "../../entities/task.entity"
import type { TaskEventPublisher } from "../../../infrastructure/messaging/publishers/task-event.publisher"

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly taskEventPublisher: TaskEventPublisher,
  ) {}

  execute = async (data: CreateTaskData): Promise<TaskEntity> => {
    const task = await this.taskRepository.create(data)

    await this.taskEventPublisher.publishTaskCreated({
      taskId: task.id,
      userId: task.userId,
      title: task.title,
      timestamp: new Date(),
    })

    return task
  }
}
