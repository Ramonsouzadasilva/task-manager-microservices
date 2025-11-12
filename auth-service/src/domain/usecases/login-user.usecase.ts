import type { IUserRepository } from "../repositories/user.repository"
import type { IRefreshTokenRepository } from "../repositories/refresh-token.repository"
import type { IHashService } from "../../application/services/hash.service"
import type { ITokenService } from "../../application/services/token.service"
import type { ICacheService } from "../../application/services/cache.service"
import { AppError } from "../../shared/errors/app-error"
import type { UserEventPublisher } from "../../infrastructure/messaging/publishers/user-event.publisher"

interface LoginInput {
  email: string
  password: string
}

interface LoginOutput {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string
  }
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
    private readonly cacheService: ICacheService,
    private readonly userEventPublisher: UserEventPublisher,
  ) {}

  execute = async (data: LoginInput): Promise<LoginOutput> => {
    const user = await this.userRepository.findByEmail(data.email)

    if (!user || !user.isActive) {
      throw new AppError("Invalid credentials", 401)
    }

    const isPasswordValid = await this.hashService.compare(data.password, user.password)

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401)
    }

    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
    })

    const refreshToken = this.tokenService.generateRefreshToken({
      userId: user.id,
    })

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    })

    await this.cacheService.set(
      `user:${user.id}`,
      JSON.stringify({ id: user.id, email: user.email, name: user.name }),
      900,
    )

    await this.userEventPublisher.publishUserLoggedIn({
      userId: user.id,
      email: user.email,
      timestamp: new Date(),
    })

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }
  }
}
