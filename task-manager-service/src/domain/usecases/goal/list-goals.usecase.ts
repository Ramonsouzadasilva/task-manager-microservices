import type { IGoalRepository } from '../../repositories/goal.repository';
import type { GoalEntity } from '../../entities/goal.entity';

export class ListGoalsUseCase {
  constructor(private readonly goalRepository: IGoalRepository) {}

  execute = async (
    userId: string,
    includeTasks = true
  ): Promise<GoalEntity[]> => {
    return await this.goalRepository.findAll(userId, includeTasks);
  };
}
