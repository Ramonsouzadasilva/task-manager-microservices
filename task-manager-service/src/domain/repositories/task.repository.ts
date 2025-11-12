import type {
  CreateTaskData,
  TaskEntity,
  UpdateTaskData,
  TaskFilters,
  PaginationParams,
  PaginatedResult,
} from '../entities/task.entity';

export interface ITaskRepository {
  create(data: CreateTaskData): Promise<TaskEntity>;
  findById(id: string, userId: string): Promise<TaskEntity | null>;
  findAll(
    userId: string,
    filters: TaskFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<TaskEntity>>;
  update(id: string, userId: string, data: UpdateTaskData): Promise<TaskEntity>;
  delete(id: string, userId: string): Promise<void>;
  countByStatus(userId: string): Promise<Record<string, number>>;
}
