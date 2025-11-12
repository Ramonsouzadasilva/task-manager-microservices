import type { PrismaClient } from "@prisma/client"
import type { IRefreshTokenRepository } from "../../domain/repositories/refresh-token.repository"
import type { CreateRefreshTokenData, RefreshTokenEntity } from "../../domain/entities/refresh-token.entity"

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateRefreshTokenData): Promise<RefreshTokenEntity> {
    return await this.prisma.refreshToken.create({
      data,
    })
  }

  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    return await this.prisma.refreshToken.findUnique({
      where: { token },
    })
  }

  async deleteByToken(token: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { token },
    })
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    })
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })
  }
}
