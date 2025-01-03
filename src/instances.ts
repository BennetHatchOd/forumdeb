import { JwtAdapter } from "./adapters/jwt.adapter"
import { MailAdapter } from "./adapters/mail.adapter"
import { MailManager } from "./utility/mail.manager"
import { AuthControllers } from "./variety/auth/api/auth.controller"
import { AuthService } from "./variety/auth/application/auth.service"
import { AuthRepository } from "./variety/auth/repositories/auth.repository"
import { BlogControllers } from "./variety/blogs/api/blog.controller"
import { BlogService } from "./variety/blogs/application/blog.service"
import { BlogQueryRepository } from "./variety/blogs/repositories/blog.query.repository"
import { BlogRepository } from "./variety/blogs/repositories/blog.repository"
import { CommentControllers } from "./variety/comments/api/comment.controller"
import { CommentService } from "./variety/comments/application/comment.service"
import { CommentQueryRepository } from "./variety/comments/repositories/comment.query.repository"
import { CommentRepository } from "./variety/comments/repositories/comment.repository"
import { DeviceControllers } from "./variety/devices/api/device.controller"
import { DeviceService } from "./variety/devices/application/device.service"
import { DeviceQueryRepository } from "./variety/devices/repositories/device.query.repository"
import { DeviceRepository } from "./variety/devices/repositories/device.repository"
import { PostControllers } from "./variety/posts/api/post.controller"
import { PostService } from "./variety/posts/application/post.service"
import { PostQueryRepository } from "./variety/posts/repositories/post.query.repository"
import { PostRepository } from "./variety/posts/repositories/post.repository"
import { UserControllers } from "./variety/users/api/user.controllers"
import { UserService } from "./variety/users/application/user.service"
import { UserQueryRepository } from "./variety/users/repositories/user.query.repository"
import { UserRepository } from "./variety/users/repositories/user.repository"

export const jwtAdapter = new JwtAdapter()
export const mailAdapter = new MailAdapter()
export const mailManager = new MailManager(mailAdapter)

export const userRepository = new UserRepository()
export const authRepository = new AuthRepository()
export const blogRepository = new BlogRepository()
export const commentRepository = new CommentRepository()
export const deviceRepository = new DeviceRepository()
export const postRepository = new PostRepository()

export const userQueryRepository = new UserQueryRepository()
export const authQueryRepository = new AuthRepository()
export const blogQueryRepository = new BlogQueryRepository()
export const commentQueryRepository = new CommentQueryRepository()
export const deviceQueryRepository = new DeviceQueryRepository()
export const postQueryRepository = new PostQueryRepository()

export const userService = new UserService(userRepository, authRepository)
export const deviceService = new DeviceService(deviceRepository)
export const authService = new AuthService(userRepository, deviceService, authRepository, 
                                           jwtAdapter, userService, deviceRepository, mailManager)
export const blogService = new BlogService(blogRepository)
export const commentService = new CommentService(commentRepository)
export const postService = new PostService(postRepository, blogRepository)


export const userControllers = new UserControllers(userService, userQueryRepository)
export const authControllers = new AuthControllers(authService, authQueryRepository)
export const blogControllers = new BlogControllers(blogService, blogQueryRepository)
export const commentControllers = new CommentControllers(commentService, commentQueryRepository)
export const deviceControllers = new DeviceControllers(authService, deviceQueryRepository, deviceService)
export const postControllers = new PostControllers(postService, postQueryRepository)



