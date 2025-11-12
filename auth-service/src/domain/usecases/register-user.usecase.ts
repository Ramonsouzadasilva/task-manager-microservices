import type { IUserRepository } from "../repositories/user.repository"
import type { IHashService } from "../../application/services/hash.service"
import type { CreateUserData, UserResponse } from "../entities/user.entity"
import { AppError } from "../../shared/errors/app-error"
import type { UserEventPublisher } from "../../infrastructure/messaging/publishers/user-event.publisher"

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly userEventPublisher: UserEventPublisher,
  ) {}

  execute = async (data: CreateUserData): Promise<UserResponse> => {
    const existingUser = await this.userRepository.findByEmail(data.email)

    if (existingUser) {
      throw new AppError("Email already in use", 409)
    }

    const hashedPassword = await this.hashService.hash(data.password)

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    })

    await this.userEventPublisher.publishUserRegistered({
      userId: user.id,
      email: user.email,
      name: user.name,
      timestamp: new Date(),
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
