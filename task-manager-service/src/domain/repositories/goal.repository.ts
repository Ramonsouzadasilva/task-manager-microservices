import type {
  CreateGoalData,
  GoalEntity,
  UpdateGoalData,
} from '../entities/goal.entity';

export interface IGoalRepository {
  create(data: CreateGoalData): Promise<GoalEntity>;
  findById(id: string, userId: string): Promise<GoalEntity | null>;
  findAll(userId: string, includeTasks?: boolean): Promise<GoalEntity[]>;
  update(id: string, userId: string, data: UpdateGoalData): Promise<GoalEntity>;
  delete(id: string, userId: string): Promise<void>;
  incrementProgress(
    id: string,
    userId: string,
    amount: number
  ): Promise<GoalEntity>;
  addTasksToGoal(
    goalId: string,
    userId: string,
    taskIds: string[]
  ): Promise<GoalEntity>;
  removeTasksFromGoal(
    goalId: string,
    userId: string,
    taskIds: string[]
  ): Promise<GoalEntity>;
}
