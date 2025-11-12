export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export interface TaskEntity {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  frequency: TaskFrequency | null;
  userId: string;
  goalId: string | null;
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  frequency?: TaskFrequency;
  userId: string;
  goalId?: string;
  dueDate?: Date;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  frequency?: TaskFrequency;
  dueDate?: Date;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  frequency?: TaskFrequency;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
