export interface MetricSummary {
  userId: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    cancelled: number;
    completedToday: number;
    completedThisWeek: number;
    completedThisMonth: number;
  };
  goals: {
    total: number;
    completed: number;
    inProgress: number;
    completionRate: number;
  };
  productivity: {
    averageTasksPerDay: number;
    averageCompletionTime: number; // em horas
    streakDays: number; // dias consecutivos com tarefas completadas
  };
  byPriority: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  byFrequency: {
    daily: number;
    weekly: number;
    monthly: number;
    oneTime: number;
  };
}

export interface MetricFilters {
  startDate?: Date;
  endDate?: Date;
  period?: 'today' | 'week' | 'month' | 'year' | 'custom';
}

export interface DailyMetric {
  date: string; // YYYY-MM-DD
  completed: number;
  created: number;
}

export interface ProductivityTrend {
  daily: DailyMetric[];
  weeklyAverage: number;
  monthlyAverage: number;
  bestDay: {
    date: string;
    count: number;
  };
}
