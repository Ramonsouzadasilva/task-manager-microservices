import type { IGoalRepository } from "../../repositories/goal.repository"
import type { CreateGoalData, GoalEntity } from "../../entities/goal.entity"

export class CreateGoalUseCase {
  constructor(private readonly goalRepository: IGoalRepository) {}

  execute = async (data: CreateGoalData): Promise<GoalEntity> => {
    return await this.goalRepository.create(data)
  }
}
