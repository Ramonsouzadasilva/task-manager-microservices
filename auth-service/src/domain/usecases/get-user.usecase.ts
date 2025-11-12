import type { IUserRepository } from "../repositories/user.repository"
import type { ICacheService } from "../../application/services/cache.service"
import type { UserResponse } from "../entities/user.entity"
import { AppError } from "../../shared/errors/app-error"

export class GetUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cacheService: ICacheService,
  ) {}

  execute = async (userId: string): Promise<UserResponse> => {
    const cachedUser = await this.cacheService.get(`user:${userId}`)

    if (cachedUser) {
      return JSON.parse(cachedUser)
    }

    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new AppError("User not found", 404)
    }

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    await this.cacheService.set(`user:${userId}`, JSON.stringify(userResponse), 900)

    return userResponse
  }
}
