import type { PrismaClient } from '@prisma/client';
import type { IGoalRepository } from '../../domain/repositories/goal.repository';
import type {
  CreateGoalData,
  GoalEntity,
  UpdateGoalData,
} from '../../domain/entities/goal.entity';

export class PrismaGoalRepository implements IGoalRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateGoalData): Promise<GoalEntity> {
    const { tasks, ...goalData } = data;

    return await this.prisma.goal.create({
      data: {
        ...goalData,
        tasks: tasks
          ? {
              create: tasks.map((task) => ({
                ...task,
                userId: goalData.userId,
              })),
            }
          : undefined,
      },
      include: {
        tasks: true,
      },
    });
  }

  async findById(id: string, userId: string): Promise<GoalEntity | null> {
    return await this.prisma.goal.findFirst({
      where: { id, userId },
      include: {
        tasks: true,
      },
    });
  }

  async findAll(userId: string, includeTasks = false): Promise<GoalEntity[]> {
    return await this.prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        tasks: includeTasks,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: UpdateGoalData
  ): Promise<GoalEntity> {
    return await this.prisma.goal.update({
      where: { id, userId },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.goal.delete({
      where: { id, userId },
    });
  }

  async incrementProgress(
    id: string,
    userId: string,
    amount: number
  ): Promise<GoalEntity> {
    return await this.prisma.goal.update({
      where: { id, userId },
      data: {
        current: {
          increment: amount,
        },
      },
    });
  }

  async addTasksToGoal(
    goalId: string,
    userId: string,
    taskIds: string[]
  ): Promise<GoalEntity> {
    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new Error('Goal not found');
    }

    await this.prisma.task.updateMany({
      where: {
        id: { in: taskIds },
        userId,
      },
      data: {
        goalId,
      },
    });

    return await this.prisma.goal.findUniqueOrThrow({
      where: { id: goalId },
      include: {
        tasks: true,
      },
    });
  }

  async removeTasksFromGoal(
    goalId: string,
    userId: string,
    taskIds: string[]
  ): Promise<GoalEntity> {
    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new Error('Goal not found');
    }

    await this.prisma.task.updateMany({
      where: {
        id: { in: taskIds },
        userId,
        goalId,
      },
      data: {
        goalId: null,
      },
    });

    return await this.prisma.goal.findUniqueOrThrow({
      where: { id: goalId },
      include: {
        tasks: true,
      },
    });
  }
}
