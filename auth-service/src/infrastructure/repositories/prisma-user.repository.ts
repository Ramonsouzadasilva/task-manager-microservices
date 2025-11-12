import type { PrismaClient } from "@prisma/client"
import type { IUserRepository } from "../../domain/repositories/user.repository"
import type { CreateUserData, UserEntity } from "../../domain/entities/user.entity"

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateUserData): Promise<UserEntity> {
    return await this.prisma.user.create({
      data,
    })
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    })
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    })
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    return await this.prisma.user.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    })
  }
}
