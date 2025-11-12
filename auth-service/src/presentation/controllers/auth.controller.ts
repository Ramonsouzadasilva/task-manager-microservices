import type { Request, Response, NextFunction } from "express"
import type { RegisterUserUseCase } from "../../domain/usecases/register-user.usecase"
import type { LoginUserUseCase } from "../../domain/usecases/login-user.usecase"
import type { RefreshTokenUseCase } from "../../domain/usecases/refresh-token.usecase"
import type { LogoutUserUseCase } from "../../domain/usecases/logout-user.usecase"
import type { GetUserUseCase } from "../../domain/usecases/get-user.usecase"
import { registerSchema, loginSchema, refreshTokenSchema } from "../../shared/validators/auth.validator"
import type { AuthRequest } from "../../shared/middlewares/auth.middleware"

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = registerSchema.parse(req.body)
      const user = await this.registerUserUseCase.execute(data)

      res.status(201).json({
        status: "success",
        data: { user },
      })
    } catch (error) {
      next(error)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = loginSchema.parse(req.body)
      const result = await this.loginUserUseCase.execute(data)

      res.status(200).json({
        status: "success",
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = refreshTokenSchema.parse(req.body)
      const result = await this.refreshTokenUseCase.execute(data)

      res.status(200).json({
        status: "success",
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body

      await this.logoutUserUseCase.execute({
        userId: req.userId!,
        refreshToken,
      })

      res.status(200).json({
        status: "success",
        message: "Logout successful",
      })
    } catch (error) {
      next(error)
    }
  }

  me = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.getUserUseCase.execute(req.userId!)

      res.status(200).json({
        status: "success",
        data: { user },
      })
    } catch (error) {
      next(error)
    }
  }
}
