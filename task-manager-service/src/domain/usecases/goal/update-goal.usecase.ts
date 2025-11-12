import type { IGoalRepository } from "../../repositories/goal.repository"
import type { GoalEntity, UpdateGoalData } from "../../entities/goal.entity"
import { AppError } from "../../../shared/errors/app-error"

export class UpdateGoalUseCase {
  constructor(private readonly goalRepository: IGoalRepository) {}

  execute = async (id: string, userId: string, data: UpdateGoalData): Promise<GoalEntity> => {
    const goal = await this.goalRepository.findById(id, userId)

    if (!goal) {
      throw new AppError("Goal not found", 404)
    }

    const updateData = { ...data }

    if (data.current && data.current >= goal.target) {
      updateData.isCompleted = true
    }

    return await this.goalRepository.update(id, userId, updateData)
  }
}
