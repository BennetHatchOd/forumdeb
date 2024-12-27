import { AuthRepository } from "./variety/auth/repositories/auth.repository"
import { PostControllers } from "./variety/posts/api/post.controller"
import { PostService } from "./variety/posts/application/post.service"
import { PostQueryRepository } from "./variety/posts/repositories/post.query.repository"
import { PostRepository } from "./variety/posts/repositories/post.repository"
import { UserControllers } from "./variety/users/api/user.controllers"
import { UserService } from "./variety/users/application/user.service"
import { UserQueryRepository } from "./variety/users/repositories/user.query.repository"
import { UserRepository } from "./variety/users/repositories/user.repository"

export const userRepository = new UserRepository()
export const authRepository = new AuthRepository()
export const blogRepository = new BlogRepository()
export const commentRepository = new CommentRepository()
export const deviceRepository = new DeviceRepository()
export const postRepository = new PostRepository()

export const userQueryRepository = new UserQueryRepository()
export const authQueryRepository = new AuthQueryRepository()
export const blogQueryRepository = new BlogQueryRepository()
export const commentQueryRepository = new CommentQueryRepository()
export const deviceQueryRepository = new DeviceQueryRepository()
export const postQueryRepository = new PostQueryRepository()

export const userService = new UserService(userRepository, authRepository)
export const authService = new AuthService(authRepository)
export const blogService = new BlogService(blogRepository)
export const commentService = new CommentService(commentRepository)
export const deviceService = new DeviceService(deviceRepository)
export const postService = new PostService(postRepository, blogRepository)


export const userControllers = new UserControllers(userService, userQueryRepository)
export const authControllers = new AuthControllers(authService, authQueryRepository)
export const blogControllers = new BlogControllers(blogService, blogQueryRepository)
export const commentControllers = new CommentControllers(commentService, commentQueryRepository)
export const deviceControllers = new DeviceControllers(deviceService, deviceQueryRepository)
export const postControllers = new PostControllers(postService, postQueryRepository)

