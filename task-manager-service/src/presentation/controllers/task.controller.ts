import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../shared/middlewares/auth.middleware';
import type { CreateTaskUseCase } from '../../domain/usecases/task/create-task.usecase';
import type { GetTaskUseCase } from '../../domain/usecases/task/get-task.usecase';
import type { ListTasksUseCase } from '../../domain/usecases/task/list-tasks.usecase';
import type { UpdateTaskUseCase } from '../../domain/usecases/task/update-task.usecase';
import type { DeleteTaskUseCase } from '../../domain/usecases/task/delete-task.usecase';
import type { GetTaskStatsUseCase } from '../../domain/usecases/task/get-task-stats.usecase';
import {
  createTaskSchema,
  updateTaskSchema,
  taskFiltersSchema,
} from '../../shared/validators/task.validator';

export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTaskUseCase: GetTaskUseCase,
    private readonly listTasksUseCase: ListTasksUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly getTaskStatsUseCase: GetTaskStatsUseCase
  ) {}

  create = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = createTaskSchema.parse(req.body);
      const task = await this.createTaskUseCase.execute({
        ...data,
        userId: req.userId!,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      });

      res.status(201).json({
        status: 'success',
        data: { task },
      });
    } catch (error) {
      next(error);
    }
  };

  get = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const task = await this.getTaskUseCase.execute(
        req.params.id,
        req.userId!
      );

      res.status(200).json({
        status: 'success',
        data: { task },
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
      const filters = taskFiltersSchema.parse(req.query);

      const result = await this.listTasksUseCase.execute(
        req.userId!,
        {
          status: filters.status,
          priority: filters.priority,
          frequency: filters.frequency,
          startDate: filters.startDate
            ? new Date(filters.startDate)
            : undefined,
          endDate: filters.endDate ? new Date(filters.endDate) : undefined,
        },
        {
          page: filters.page,
          limit: filters.limit,
        }
      );

      res.status(200).json({
        status: 'success',
        data: result,
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
      const data = updateTaskSchema.parse(req.body);
      const task = await this.updateTaskUseCase.execute(
        req.params.id,
        req.userId!,
        {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        }
      );

      res.status(200).json({
        status: 'success',
        data: { task },
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
      await this.deleteTaskUseCase.execute(req.params.id, req.userId!);

      res.status(200).json({
        status: 'success',
        message: 'Task deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  stats = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const stats = await this.getTaskStatsUseCase.execute(req.userId!);

      res.status(200).json({
        status: 'success',
        data: { stats },
      });
    } catch (error) {
      next(error);
    }
  };
}
