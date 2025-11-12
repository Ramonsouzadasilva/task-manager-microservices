import type { ITaskRepository } from "../../repositories/task.repository"
import { type TaskEntity, type UpdateTaskData, TaskStatus } from "../../entities/task.entity"
import { AppError } from "../../../shared/errors/app-error"
import type { TaskEventPublisher } from "../../../infrastructure/messaging/publishers/task-event.publisher"

export class UpdateTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly taskEventPublisher: TaskEventPublisher,
  ) {}

  execute = async (id: string, userId: string, data: UpdateTaskData): Promise<TaskEntity> => {
    const task = await this.taskRepository.findById(id, userId)

    if (!task) {
      throw new AppError("Task not found", 404)
    }

    const updateData = { ...data }

    if (data.status === TaskStatus.COMPLETED) {
      ;(updateData as any).completedAt = new Date()
    }

    const updatedTask = await this.taskRepository.update(id, userId, updateData)

    if (data.status === TaskStatus.COMPLETED) {
      await this.taskEventPublisher.publishTaskCompleted({
        taskId: updatedTask.id,
        userId: updatedTask.userId,
        title: updatedTask.title,
        timestamp: new Date(),
      })
    }

    return updatedTask
  }
}
