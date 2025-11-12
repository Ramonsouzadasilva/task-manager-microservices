import type { ITaskRepository } from "../../repositories/task.repository"
import { AppError } from "../../../shared/errors/app-error"

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  execute = async (id: string, userId: string): Promise<void> => {
    const task = await this.taskRepository.findById(id, userId)

    if (!task) {
      throw new AppError("Task not found", 404)
    }

    await this.taskRepository.delete(id, userId)
  }
}
