import { PrismaService } from "../../infrastructure/database/prisma.service"
import { PrismaTaskRepository } from "../../infrastructure/repositories/prisma-task.repository"
import { CreateTaskUseCase } from "../../domain/usecases/task/create-task.usecase"
import { GetTaskUseCase } from "../../domain/usecases/task/get-task.usecase"
import { ListTasksUseCase } from "../../domain/usecases/task/list-tasks.usecase"
import { UpdateTaskUseCase } from "../../domain/usecases/task/update-task.usecase"
import { DeleteTaskUseCase } from "../../domain/usecases/task/delete-task.usecase"
import { GetTaskStatsUseCase } from "../../domain/usecases/task/get-task-stats.usecase"
import { TaskController } from "../../presentation/controllers/task.controller"
import { TaskEventPublisher } from "../../infrastructure/messaging/publishers/task-event.publisher"

export const makeTaskController = (): TaskController => {
  const prisma = PrismaService.getInstance()
  const taskRepository = new PrismaTaskRepository(prisma)
  const taskEventPublisher = new TaskEventPublisher()

  const createTaskUseCase = new CreateTaskUseCase(taskRepository, taskEventPublisher)
  const getTaskUseCase = new GetTaskUseCase(taskRepository)
  const listTasksUseCase = new ListTasksUseCase(taskRepository)
  const updateTaskUseCase = new UpdateTaskUseCase(taskRepository, taskEventPublisher)
  const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository)
  const getTaskStatsUseCase = new GetTaskStatsUseCase(taskRepository)

  return new TaskController(
    createTaskUseCase,
    getTaskUseCase,
    listTasksUseCase,
    updateTaskUseCase,
    deleteTaskUseCase,
    getTaskStatsUseCase,
  )
}
