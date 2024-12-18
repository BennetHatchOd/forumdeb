import { BlogEndPoint } from "./classes/blogClass"
import { PostEndPoint } from "./classes/postClass"

export const initialize = async() =>{
    const blog = new BlogEndPoint()
    const post = new PostEndPoint()
    await blog.initialize(post)
    await post.initialize(blog)

    return{blog, post}
}