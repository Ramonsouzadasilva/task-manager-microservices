import type { PrismaClient } from '@prisma/client';
import type { ITaskRepository } from '../../domain/repositories/task.repository';
import type {
  CreateTaskData,
  TaskEntity,
  UpdateTaskData,
  TaskFilters,
  PaginationParams,
  PaginatedResult,
} from '../../domain/entities/task.entity';

export class PrismaTaskRepository implements ITaskRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateTaskData): Promise<TaskEntity> {
    return await this.prisma.task.create({
      data,
    });
  }

  async findById(id: string, userId: string): Promise<TaskEntity | null> {
    return await this.prisma.task.findFirst({
      where: { id, userId },
    });
  }

  async findAll(
    userId: string,
    filters: TaskFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<TaskEntity>> {
    const where: any = { userId };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    if (filters.frequency) {
      where.frequency = filters.frequency;
    }

    if (filters.startDate || filters.endDate) {
      where.dueDate = {};
      if (filters.startDate) {
        where.dueDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.dueDate.lte = filters.endDate;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async update(
    id: string,
    userId: string,
    data: UpdateTaskData
  ): Promise<TaskEntity> {
    return await this.prisma.task.update({
      where: { id, userId },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.task.delete({
      where: { id, userId },
    });
  }

  async countByStatus(userId: string): Promise<Record<string, number>> {
    const results = await this.prisma.task.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true },
    });

    return results.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {} as Record<string, number>);
  }
}
