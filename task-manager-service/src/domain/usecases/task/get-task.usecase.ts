import type { ITaskRepository } from "../../repositories/task.repository"
import type { TaskEntity } from "../../entities/task.entity"
import { AppError } from "../../../shared/errors/app-error"

export class GetTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  execute = async (id: string, userId: string): Promise<TaskEntity> => {
    const task = await this.taskRepository.findById(id, userId)

    if (!task) {
      throw new AppError("Task not found", 404)
    }

    return task
  }
}
