import type { IRefreshTokenRepository } from "../repositories/refresh-token.repository"
import type { ICacheService } from "../../application/services/cache.service"
import type { UserEventPublisher } from "../../infrastructure/messaging/publishers/user-event.publisher"

interface LogoutInput {
  userId: string
  refreshToken?: string
}

export class LogoutUserUseCase {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly cacheService: ICacheService,
    private readonly userEventPublisher: UserEventPublisher,
  ) {}

  execute = async (data: LogoutInput): Promise<void> => {
    if (data.refreshToken) {
      await this.refreshTokenRepository.deleteByToken(data.refreshToken)
    } else {
      await this.refreshTokenRepository.deleteByUserId(data.userId)
    }

    await this.cacheService.delete(`user:${data.userId}`)

    await this.userEventPublisher.publishUserLoggedOut({
      userId: data.userId,
      timestamp: new Date(),
    })
  }
}
