import type { ITaskRepository } from "../../repositories/task.repository"

export interface TaskStats {
  total: number
  pending: number
  inProgress: number
  completed: number
  cancelled: number
}

export class GetTaskStatsUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  execute = async (userId: string): Promise<TaskStats> => {
    const stats = await this.taskRepository.countByStatus(userId)

    return {
      total: Object.values(stats).reduce((sum, count) => sum + count, 0),
      pending: stats.PENDING || 0,
      inProgress: stats.IN_PROGRESS || 0,
      completed: stats.COMPLETED || 0,
      cancelled: stats.CANCELLED || 0,
    }
  }
}
