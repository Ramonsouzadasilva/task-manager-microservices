export interface UserEntity {
  id: string
  email: string
  name: string
  password: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserData {
  email: string
  name: string
  password: string
}

export interface UserResponse {
  id: string
  email: string
  name: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
