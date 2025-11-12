import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().datetime().optional(),
});

export const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  target: z.number().positive('Target must be positive'),
  deadline: z.string().datetime().optional(),
  tasks: z.array(taskSchema).optional(),
});

export const updateGoalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  target: z.number().positive().optional(),
  current: z.number().min(0).optional(),
  deadline: z.string().datetime().optional(),
  isCompleted: z.boolean().optional(),
});

export const addTasksToGoalSchema = z.object({
  taskIds: z
    .array(z.string().uuid())
    .min(1, 'At least one task ID is required'),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type AddTasksToGoalInput = z.infer<typeof addTasksToGoalSchema>;
