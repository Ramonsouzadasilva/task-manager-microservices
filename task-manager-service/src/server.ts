import dotenv from "dotenv"
dotenv.config()

import { createApp } from "./main/app"
import { bootstrap, shutdown } from "./main/bootstrap"

const PORT = process.env.PORT || 3002

const startServer = async (): Promise<void> => {
  try {
    await bootstrap()

    const app = createApp()

    const server = app.listen(PORT, () => {
      console.log(`[Server] Task Manager Service running on port ${PORT}`)
      console.log(`[Server] API Documentation: http://localhost:${PORT}/api-docs`)
    })

    const gracefulShutdown = async (signal: string): Promise<void> => {
      console.log(`\n[Server] ${signal} received, starting graceful shutdown...`)

      server.close(async () => {
        console.log("[Server] HTTP server closed")
        await shutdown()
        process.exit(0)
      })

      setTimeout(() => {
        console.error("[Server] Forced shutdown after timeout")
        process.exit(1)
      }, 10000)
    }

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
    process.on("SIGINT", () => gracefulShutdown("SIGINT"))
  } catch (error) {
    console.error("[Server] Failed to start:", error)
    process.exit(1)
  }
}

startServer()
