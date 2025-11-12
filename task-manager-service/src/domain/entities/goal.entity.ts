import type { TaskEntity } from './task.entity';

export interface GoalEntity {
  id: string;
  title: string;
  description: string | null;
  userId: string;
  target: number;
  current: number;
  deadline: Date | null;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  tasks?: TaskEntity[];
}

export interface CreateGoalData {
  title: string;
  description?: string;
  userId: string;
  target: number;
  deadline?: Date;
  tasks?: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: Date;
  }[];
}

export interface UpdateGoalData {
  title?: string;
  description?: string;
  target?: number;
  current?: number;
  deadline?: Date;
  isCompleted?: boolean;
}
