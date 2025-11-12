import type { Request, Response, NextFunction } from "express"
import { JwtTokenService } from "../../infrastructure/services/jwt-token.service"
import { AppError } from "../errors/app-error"

export interface AuthRequest extends Request {
  userId?: string
  userEmail?: string
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

    const tokenService = new JwtTokenService()
    const payload = tokenService.verifyAccessToken(token)

    req.userId = payload.userId
    req.userEmail = payload.email

    next()
  } catch (error) {
    next(error)
  }
}
