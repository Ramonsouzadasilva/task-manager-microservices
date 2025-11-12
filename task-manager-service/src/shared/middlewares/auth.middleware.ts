import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { AppError } from "../errors/app-error"

export interface AuthRequest extends Request {
  userId?: string
  userEmail?: string
}

interface TokenPayload {
  userId: string
  email?: string
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new AppError("No token provided", 401)
    }

    const [, token] = authHeader.split(" ")

    if (!token) {
      throw new AppError("Invalid token format", 401)
    }

    const secret = process.env.JWT_SECRET || "secret"
    const payload = jwt.verify(token, secret) as TokenPayload

    req.userId = payload.userId
    req.userEmail = payload.email

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError("Invalid token", 401))
    } else {
      next(error)
    }
  }
}
