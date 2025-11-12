export enum TaskEvent {
  TASK_CREATED = "task.created",
  TASK_UPDATED = "task.updated",
  TASK_COMPLETED = "task.completed",
  TASK_DELETED = "task.deleted",
  GOAL_CREATED = "goal.created",
  GOAL_COMPLETED = "goal.completed",
}

export interface TaskCreatedPayload {
  taskId: string
  userId: string
  title: string
  timestamp: Date
}

export interface TaskCompletedPayload {
  taskId: string
  userId: string
  title: string
  timestamp: Date
}
