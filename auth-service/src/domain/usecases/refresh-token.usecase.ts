import type { IRefreshTokenRepository } from "../repositories/refresh-token.repository"
import type { ITokenService } from "../../application/services/token.service"
import { AppError } from "../../shared/errors/app-error"

interface RefreshTokenInput {
  refreshToken: string
}

interface RefreshTokenOutput {
  accessToken: string
  refreshToken: string
}

export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly tokenService: ITokenService,
  ) {}

  execute = async (data: RefreshTokenInput): Promise<RefreshTokenOutput> => {
    const payload = this.tokenService.verifyRefreshToken(data.refreshToken)

    const storedToken = await this.refreshTokenRepository.findByToken(data.refreshToken)

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AppError("Invalid or expired refresh token", 401)
    }

    await this.refreshTokenRepository.deleteByToken(data.refreshToken)

    const accessToken = this.tokenService.generateAccessToken({
      userId: payload.userId,
      email: payload.email,
    })

    const newRefreshToken = this.tokenService.generateRefreshToken({
      userId: payload.userId,
    })

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await this.refreshTokenRepository.create({
      token: newRefreshToken,
      userId: payload.userId,
      expiresAt,
    })

    return {
      accessToken,
      refreshToken: newRefreshToken,
    }
  }
}
