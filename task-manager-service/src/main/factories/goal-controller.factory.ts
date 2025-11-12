import { PrismaService } from '../../infrastructure/database/prisma.service';
import { PrismaGoalRepository } from '../../infrastructure/repositories/prisma-goal.repository';
import { CreateGoalUseCase } from '../../domain/usecases/goal/create-goal.usecase';
import { ListGoalsUseCase } from '../../domain/usecases/goal/list-goals.usecase';
import { UpdateGoalUseCase } from '../../domain/usecases/goal/update-goal.usecase';
import { DeleteGoalUseCase } from '../../domain/usecases/goal/delete-goal.usecase';
import { AddTasksToGoalUseCase } from '../../domain/usecases/goal/add-tasks-to-goal.usecase';
import { RemoveTasksFromGoalUseCase } from '../../domain/usecases/goal/remove-tasks-from-goal.usecase';
import { GoalController } from '../../presentation/controllers/goal.controller';

export const makeGoalController = (): GoalController => {
  const prisma = PrismaService.getInstance();
  const goalRepository = new PrismaGoalRepository(prisma);

  const createGoalUseCase = new CreateGoalUseCase(goalRepository);
  const listGoalsUseCase = new ListGoalsUseCase(goalRepository);
  const updateGoalUseCase = new UpdateGoalUseCase(goalRepository);
  const deleteGoalUseCase = new DeleteGoalUseCase(goalRepository);
  const addTasksToGoalUseCase = new AddTasksToGoalUseCase(goalRepository);
  const removeTasksFromGoalUseCase = new RemoveTasksFromGoalUseCase(
    goalRepository
  );

  return new GoalController(
    createGoalUseCase,
    listGoalsUseCase,
    updateGoalUseCase,
    deleteGoalUseCase,
    addTasksToGoalUseCase,
    removeTasksFromGoalUseCase
  );
};
