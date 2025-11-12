export enum UserEvent {
  USER_REGISTERED = "user.registered",
  USER_LOGGED_IN = "user.logged_in",
  USER_LOGGED_OUT = "user.logged_out",
  USER_UPDATED = "user.updated",
  USER_DELETED = "user.deleted",
}

export interface UserRegisteredPayload {
  userId: string
  email: string
  name: string
  timestamp: Date
}

export interface UserLoggedInPayload {
  userId: string
  email: string
  timestamp: Date
}

export interface UserLoggedOutPayload {
  userId: string
  timestamp: Date
}
