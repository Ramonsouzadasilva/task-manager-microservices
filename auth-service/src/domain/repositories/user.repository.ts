import type { CreateUserData, UserEntity } from "../entities/user.entity"

export interface IUserRepository {
  create(data: CreateUserData): Promise<UserEntity>
  findById(id: string): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity>
  delete(id: string): Promise<void>
}
