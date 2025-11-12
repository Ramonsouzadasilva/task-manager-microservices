import { PrismaService } from "../../infrastructure/database/prisma.service"
import { PrismaUserRepository } from "../../infrastructure/repositories/prisma-user.repository"
import { PrismaRefreshTokenRepository } from "../../infrastructure/repositories/prisma-refresh-token.repository"
import { BcryptHashService } from "../../infrastructure/services/bcrypt-hash.service"
import { JwtTokenService } from "../../infrastructure/services/jwt-token.service"
import { RedisCacheService } from "../../infrastructure/services/redis-cache.service"
import { RegisterUserUseCase } from "../../domain/usecases/register-user.usecase"
import { LoginUserUseCase } from "../../domain/usecases/login-user.usecase"
import { RefreshTokenUseCase } from "../../domain/usecases/refresh-token.usecase"
import { LogoutUserUseCase } from "../../domain/usecases/logout-user.usecase"
import { GetUserUseCase } from "../../domain/usecases/get-user.usecase"
import { AuthController } from "../../presentation/controllers/auth.controller"
import { UserEventPublisher } from "../../infrastructure/messaging/publishers/user-event.publisher"

export const makeAuthController = (): AuthController => {
  const prisma = PrismaService.getInstance()
  const userRepository = new PrismaUserRepository(prisma)
  const refreshTokenRepository = new PrismaRefreshTokenRepository(prisma)
  const hashService = new BcryptHashService()
  const tokenService = new JwtTokenService()
  const cacheService = new RedisCacheService()
  const userEventPublisher = new UserEventPublisher()

  const registerUserUseCase = new RegisterUserUseCase(userRepository, hashService, userEventPublisher)

  const loginUserUseCase = new LoginUserUseCase(
    userRepository,
    refreshTokenRepository,
    hashService,
    tokenService,
    cacheService,
    userEventPublisher,
  )

  const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepository, tokenService)

  const logoutUserUseCase = new LogoutUserUseCase(refreshTokenRepository, cacheService, userEventPublisher)

  const getUserUseCase = new GetUserUseCase(userRepository, cacheService)

  return new AuthController(
    registerUserUseCase,
    loginUserUseCase,
    refreshTokenUseCase,
    logoutUserUseCase,
    getUserUseCase,
  )
}
