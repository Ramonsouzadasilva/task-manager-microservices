export interface RefreshTokenEntity {
  id: string
  token: string
  userId: string
  expiresAt: Date
  createdAt: Date
}

export interface CreateRefreshTokenData {
  token: string
  userId: string
  expiresAt: Date
}
