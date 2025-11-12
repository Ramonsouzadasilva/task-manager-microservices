import type { IGoalRepository } from "../../repositories/goal.repository"
import { AppError } from "../../../shared/errors/app-error"

export class DeleteGoalUseCase {
  constructor(private readonly goalRepository: IGoalRepository) {}

  execute = async (id: string, userId: string): Promise<void> => {
    const goal = await this.goalRepository.findById(id, userId)

    if (!goal) {
      throw new AppError("Goal not found", 404)
    }

    await this.goalRepository.delete(id, userId)
  }
}
