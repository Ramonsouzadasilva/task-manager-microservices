import express, { type Express } from "express"
import cors from "cors"
import helmet from "helmet"
import swaggerUi from "swagger-ui-express"
import { createTaskRoutes } from "../presentation/routes/task.routes"
import { createGoalRoutes } from "../presentation/routes/goal.routes"
import { createMetricRoutes } from "../presentation/routes/metric.routes"
import { makeTaskController } from "./factories/task-controller.factory"
import { makeGoalController } from "./factories/goal-controller.factory"
import { makeMetricController } from "./factories/metric-controller.factory"
import { errorHandler } from "../shared/middlewares/error-handler.middleware"
import { swaggerSpec } from "./config/swagger.config"
import { rateLimiter } from "./config/rate-limit.config"

export const createApp = (): Express => {
  const app = express()

  app.use(helmet())
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use("/api", rateLimiter)

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  const taskController = makeTaskController()
  const goalController = makeGoalController()
  const metricController = makeMetricController()

  app.use("/api/tasks", createTaskRoutes(taskController))
  app.use("/api/goals", createGoalRoutes(goalController))
  app.use("/api/metrics", createMetricRoutes(metricController))

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "task-manager-service" })
  })

  app.use(errorHandler)

  return app
}
