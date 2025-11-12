import type { CreateRefreshTokenData, RefreshTokenEntity } from "../entities/refresh-token.entity"

export interface IRefreshTokenRepository {
  create(data: CreateRefreshTokenData): Promise<RefreshTokenEntity>
  findByToken(token: string): Promise<RefreshTokenEntity | null>
  deleteByToken(token: string): Promise<void>
  deleteByUserId(userId: string): Promise<void>
  deleteExpired(): Promise<void>
}
