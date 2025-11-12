import type { ITaskRepository } from "../../repositories/task.repository"
import type { TaskEntity, TaskFilters, PaginationParams, PaginatedResult } from "../../entities/task.entity"

export class ListTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  execute = async (
    userId: string,
    filters: TaskFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<TaskEntity>> => {
    return await this.taskRepository.findAll(userId, filters, pagination)
  }
}
