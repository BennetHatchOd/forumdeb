import { BlogEndPoint } from "./blogClass"
import { PostEndPoint } from "./postClass"

export const initialize = async() =>{
    const blog = new BlogEndPoint()
    const post = new PostEndPoint()
    await blog.initialize(post)
    await post.initialize(blog)

    return{blog, post}
}