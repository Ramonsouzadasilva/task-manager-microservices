import type { IGoalRepository } from '../../repositories/goal.repository';
import type { GoalEntity } from '../../entities/goal.entity';

export class RemoveTasksFromGoalUseCase {
  constructor(private readonly goalRepository: IGoalRepository) {}

  execute = async (
    goalId: string,
    userId: string,
    taskIds: string[]
  ): Promise<GoalEntity> => {
    if (!taskIds || taskIds.length === 0) {
      throw new Error('Task IDs are required');
    }

    return await this.goalRepository.removeTasksFromGoal(
      goalId,
      userId,
      taskIds
    );
  };
}
