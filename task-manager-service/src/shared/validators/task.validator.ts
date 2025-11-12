import { z } from "zod"

export const taskStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
export const taskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
export const taskFrequencyEnum = z.enum(["DAILY", "WEEKLY", "MONTHLY"])

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  priority: taskPriorityEnum.optional(),
  frequency: taskFrequencyEnum.optional(),
  dueDate: z.string().datetime().optional(),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  frequency: taskFrequencyEnum.optional(),
  dueDate: z.string().datetime().optional(),
})

export const taskFiltersSchema = z.object({
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  frequency: taskFrequencyEnum.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type TaskFiltersInput = z.infer<typeof taskFiltersSchema>
