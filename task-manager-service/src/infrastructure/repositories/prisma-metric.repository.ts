import type { PrismaClient } from '@prisma/client';
import type { IMetricRepository } from '../../domain/repositories/metric.repository';
import type {
  MetricSummary,
  MetricFilters,
  ProductivityTrend,
  DailyMetric,
} from '../../domain/entities/metric.entity';

export class PrismaMetricRepository implements IMetricRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getMetricsSummary(
    userId: string,
    filters?: MetricFilters
  ): Promise<MetricSummary> {
    const { startDate, endDate } = this.getDateRange(filters);

    // Buscar todas as tasks do período
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Buscar todos os goals
    const goals = await this.prisma.goal.findMany({
      where: { userId },
    });

    // Calcular métricas de tasks
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
    const pendingTasks = tasks.filter((t) => t.status === 'PENDING');
    const cancelledTasks = tasks.filter((t) => t.status === 'CANCELLED');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const completedToday = completedTasks.filter(
      (t) => t.completedAt && t.completedAt >= today
    ).length;

    const completedThisWeek = completedTasks.filter(
      (t) => t.completedAt && t.completedAt >= weekAgo
    ).length;

    const completedThisMonth = completedTasks.filter(
      (t) => t.completedAt && t.completedAt >= monthAgo
    ).length;

    // Calcular métricas de goals
    const totalGoals = goals.length;
    const completedGoals = goals.filter((g) => g.isCompleted).length;
    const inProgressGoals = goals.filter(
      (g) => !g.isCompleted && g.current > 0
    ).length;
    const completionRate =
      totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    // Calcular produtividade
    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const averageTasksPerDay = daysDiff > 0 ? totalTasks / daysDiff : 0;

    // Calcular tempo médio de conclusão
    const completedWithTime = completedTasks.filter(
      (t) => t.completedAt && t.createdAt
    );
    const totalCompletionTime = completedWithTime.reduce((sum, task) => {
      const time =
        (task.completedAt!.getTime() - task.createdAt.getTime()) /
        (1000 * 60 * 60);
      return sum + time;
    }, 0);
    const averageCompletionTime =
      completedWithTime.length > 0
        ? totalCompletionTime / completedWithTime.length
        : 0;

    // Calcular streak (dias consecutivos com tarefas completadas)
    const streakDays = await this.calculateStreak(userId);

    // Métricas por prioridade
    const byPriority = {
      urgent: tasks.filter((t) => t.priority === 'URGENT').length,
      high: tasks.filter((t) => t.priority === 'HIGH').length,
      medium: tasks.filter((t) => t.priority === 'MEDIUM').length,
      low: tasks.filter((t) => t.priority === 'LOW').length,
    };

    // Métricas por frequência
    const byFrequency = {
      daily: tasks.filter((t) => t.frequency === 'DAILY').length,
      weekly: tasks.filter((t) => t.frequency === 'WEEKLY').length,
      monthly: tasks.filter((t) => t.frequency === 'MONTHLY').length,
      oneTime: tasks.filter((t) => !t.frequency).length,
    };

    return {
      userId,
      period: { startDate, endDate },
      tasks: {
        total: totalTasks,
        completed: completedTasks.length,
        inProgress: inProgressTasks.length,
        pending: pendingTasks.length,
        cancelled: cancelledTasks.length,
        completedToday,
        completedThisWeek,
        completedThisMonth,
      },
      goals: {
        total: totalGoals,
        completed: completedGoals,
        inProgress: inProgressGoals,
        completionRate: Math.round(completionRate * 100) / 100,
      },
      productivity: {
        averageTasksPerDay: Math.round(averageTasksPerDay * 100) / 100,
        averageCompletionTime: Math.round(averageCompletionTime * 100) / 100,
        streakDays,
      },
      byPriority,
      byFrequency,
    };
  }

  async getProductivityTrend(
    userId: string,
    filters?: MetricFilters
  ): Promise<ProductivityTrend> {
    const { startDate, endDate } = this.getDateRange(filters);

    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        OR: [
          {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            completedAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    // Agrupar por dia
    const dailyMap = new Map<string, DailyMetric>();

    for (const task of tasks) {
      // Contar criadas
      const createdDate = task.createdAt.toISOString().split('T')[0];
      if (!dailyMap.has(createdDate)) {
        dailyMap.set(createdDate, {
          date: createdDate,
          completed: 0,
          created: 0,
        });
      }
      dailyMap.get(createdDate)!.created++;

      // Contar completadas
      if (task.completedAt && task.status === 'COMPLETED') {
        const completedDate = task.completedAt.toISOString().split('T')[0];
        if (!dailyMap.has(completedDate)) {
          dailyMap.set(completedDate, {
            date: completedDate,
            completed: 0,
            created: 0,
          });
        }
        dailyMap.get(completedDate)!.completed++;
      }
    }

    const daily = Array.from(dailyMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // Calcular médias
    const totalCompleted = daily.reduce((sum, d) => sum + d.completed, 0);
    const totalDays = daily.length || 1;
    const weeklyAverage =
      Math.round((totalCompleted / totalDays) * 7 * 100) / 100;
    const monthlyAverage =
      Math.round((totalCompleted / totalDays) * 30 * 100) / 100;

    // Encontrar melhor dia
    const bestDay = daily.reduce(
      (best, current) =>
        current.completed > best.count
          ? { date: current.date, count: current.completed }
          : best,
      { date: '', count: 0 }
    );

    return {
      daily,
      weeklyAverage,
      monthlyAverage,
      bestDay,
    };
  }

  private async calculateStreak(userId: string): Promise<number> {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: { not: null },
      },
      orderBy: { completedAt: 'desc' },
    });

    if (tasks.length === 0) return 0;

    let streak = 0;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const completedDates = new Set(
      tasks.map((t) => {
        const date = new Date(t.completedAt!);
        date.setHours(0, 0, 0, 0);
        return date.toISOString();
      })
    );

    while (completedDates.has(currentDate.toISOString())) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  private getDateRange(filters?: MetricFilters): {
    startDate: Date;
    endDate: Date;
  } {
    const endDate = new Date();
    const startDate = new Date();

    if (filters?.startDate && filters?.endDate) {
      return { startDate: filters.startDate, endDate: filters.endDate };
    }

    switch (filters?.period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1); // Default: último mês
    }

    return { startDate, endDate };
  }
}
