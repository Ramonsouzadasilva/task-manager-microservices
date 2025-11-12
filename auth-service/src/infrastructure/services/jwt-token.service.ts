import jwt from "jsonwebtoken"
import type { ITokenService, TokenPayload } from "../../application/services/token.service"
import { AppError } from "../../shared/errors/app-error"

export class JwtTokenService implements ITokenService {
  private readonly accessSecret: string
  private readonly refreshSecret: string
  private readonly accessExpiresIn: string
  private readonly refreshExpiresIn: string

  constructor() {
    this.accessSecret = process.env.JWT_SECRET || "secret"
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || "refresh-secret"
    this.accessExpiresIn = process.env.JWT_EXPIRES_IN || "15m"
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d"
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiresIn,
    })
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn,
    })
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.accessSecret) as TokenPayload
    } catch (error) {
      throw new AppError("Invalid or expired token", 401)
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.refreshSecret) as TokenPayload
    } catch (error) {
      throw new AppError("Invalid or expired refresh token", 401)
    }
  }
}
