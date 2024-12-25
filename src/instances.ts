import { AuthRepository } from "./variety/auth/repositories/auth.repository"
import { UserControllers } from "./variety/users/api/user.controllers"
import { UserService } from "./variety/users/application/user.service"
import { UserQueryRepository } from "./variety/users/repositories/user.query.repository"
import { UserRepository } from "./variety/users/repositories/user.repository"

export const userRepository = new UserRepository()
export const authRepository = new AuthRepository()
export const userQueryRepository = new UserQueryRepository()
export const userService = new UserService(userRepository, authRepository)
export const userControllers = new UserControllers(userService, userQueryRepository)
