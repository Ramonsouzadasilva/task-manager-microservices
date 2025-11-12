import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../shared/middlewares/auth.middleware';
import type { CreateGoalUseCase } from '../../domain/usecases/goal/create-goal.usecase';
import type { ListGoalsUseCase } from '../../domain/usecases/goal/list-goals.usecase';
import type { UpdateGoalUseCase } from '../../domain/usecases/goal/update-goal.usecase';
import type { DeleteGoalUseCase } from '../../domain/usecases/goal/delete-goal.usecase';
import type { AddTasksToGoalUseCase } from '../../domain/usecases/goal/add-tasks-to-goal.usecase';
import type { RemoveTasksFromGoalUseCase } from '../../domain/usecases/goal/remove-tasks-from-goal.usecase';
import {
  createGoalSchema,
  updateGoalSchema,
  addTasksToGoalSchema,
} from '../../shared/validators/goal.validator';

export class GoalController {
  constructor(
    private readonly createGoalUseCase: CreateGoalUseCase,
    private readonly listGoalsUseCase: ListGoalsUseCase,
    private readonly updateGoalUseCase: UpdateGoalUseCase,
    private readonly deleteGoalUseCase: DeleteGoalUseCase,
    private readonly addTasksToGoalUseCase: AddTasksToGoalUseCase,
    private readonly removeTasksFromGoalUseCase: RemoveTasksFromGoalUseCase
  ) {}

  create = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = createGoalSchema.parse(req.body);
      const goal = await this.createGoalUseCase.execute({
        ...data,
        userId: req.userId!,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        tasks: data.tasks?.map((task) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        })),
      });

      res.status(201).json({
        status: 'success',
        data: { goal },
      });
    } catch (error) {
      next(error);
    }
  };

  list = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const goals = await this.listGoalsUseCase.execute(req.userId!);

      res.status(200).json({
        status: 'success',
        data: { goals },
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = updateGoalSchema.parse(req.body);
      const goal = await this.updateGoalUseCase.execute(
        req.params.id,
        req.userId!,
        {
          ...data,
          deadline: data.deadline ? new Date(data.deadline) : undefined,
        }
      );

      res.status(200).json({
        status: 'success',
        data: { goal },
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.deleteGoalUseCase.execute(req.params.id, req.userId!);

      res.status(200).json({
        status: 'success',
        message: 'Goal deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  addTasks = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { taskIds } = addTasksToGoalSchema.parse(req.body);
      const goal = await this.addTasksToGoalUseCase.execute(
        req.params.id,
        req.userId!,
        taskIds
      );

      res.status(200).json({
        status: 'success',
        data: { goal },
      });
    } catch (error) {
      next(error);
    }
  };

  removeTasks = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { taskIds } = addTasksToGoalSchema.parse(req.body);
      const goal = await this.removeTasksFromGoalUseCase.execute(
        req.params.id,
        req.userId!,
        taskIds
      );

      res.status(200).json({
        status: 'success',
        data: { goal },
      });
    } catch (error) {
      next(error);
    }
  };
}
