import type { Request, Response, NextFunction } from "express"
import { AppError } from "../errors/app-error"
import { ZodError } from "zod"

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    })
    return
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      status: "error",
      message: "Validation error",
      errors: error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    })
    return
  }

  console.error("[Error Handler]:", error)

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  })
}
