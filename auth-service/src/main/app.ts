import express, { type Express } from "express"
import cors from "cors"
import helmet from "helmet"
import swaggerUi from "swagger-ui-express"
import { createAuthRoutes } from "../presentation/routes/auth.routes"
import { makeAuthController } from "./factories/auth-controller.factory"
import { errorHandler } from "../shared/middlewares/error-handler.middleware"
import { swaggerSpec } from "./config/swagger.config"
import { rateLimiter, authRateLimiter } from "./config/rate-limit.config"

export const createApp = (): Express => {
  const app = express()

  app.use(helmet())
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use("/api", rateLimiter)

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  const authController = makeAuthController()
  const authRoutes = createAuthRoutes(authController)

  app.use("/api/auth/login", authRateLimiter)
  app.use("/api/auth/register", authRateLimiter)

  app.use("/api/auth", authRoutes)

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "auth-service" })
  })

  app.use(errorHandler)

  return app
}
