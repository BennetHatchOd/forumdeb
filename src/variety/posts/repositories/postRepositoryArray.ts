// import { PostViewModel, PostInputModel, BlogViewModel } from "../../../types";
// import {db} from "../../../db/dbArray"
// import { blogRepository } from "../../blogs/repositories/index";

// export const postRepositoryArray = {

//  // searches for a post by id and returns the post or null
//     async find(id: string): Promise < PostViewModel | null > {
//         const searchItem: PostViewModel = db.posts.find(c => c.id === id);
        
//         if(!searchItem) 
//             return null;

//     return searchItem;
//     },
     
// // creates new post and returns this post    
//     async create(createItem: PostInputModel): Promise <PostViewModel>{

//         let today = new Date();
//         const id = today.getHours() * 1000000000 + today.getMinutes() * 1000000 + today.getSeconds() * 1000 + today.getMilliseconds();
//         let blogName: string;
//         try{
//             const parentBlog:  BlogViewModel | null  = await blogRepository.find(createItem.blogId); 
//             if(!parentBlog)
//                 throw `blog with ID: ${createItem.blogId} doesn't exist`;
//             blogName = parentBlog.name; 
//         }
//         catch(error){
//             console.log(error);
//             blogName = "blog  doesn't exist";

//         }

//         const newPost: PostViewModel = {
//           id: id.toString(),
//           title: createItem.title,
//           shortDescription: createItem.shortDescription,
//           content: createItem.content,
//           blogId: createItem.blogId,
//           blogName: blogName
//         }           
//         db.posts.push(newPost); 
//         return newPost;
//     },

//     // deletes a post by Id, returns true if the post existed
//     async delete(id: string): Promise < boolean > { 
//         if(db.posts.findIndex(n => n.id === id) == -1)
//             return false;
//         db.posts = db.posts.filter(n => n.id !== id);
//         return true;
//     },
   
// // edits a post by ID, if the post is not found returns false    
//     async edit(id: string, correctPost: PostInputModel): Promise <boolean> {
//         const foundPost: PostViewModel = db.posts.find(c => c.id === id);
//         if(!foundPost)
//             return false;

//         foundPost.title = correctPost.title;
//         foundPost.shortDescription = correctPost.shortDescription;
//         foundPost.content = correctPost.content; 
        
//         if (foundPost.blogId != correctPost.blogId){

//             foundPost.blogId = correctPost.blogId;  
//             try{
//                 const parentBlog:  BlogViewModel | null  = await blogRepository.find(correctPost.blogId); 
//                 if(!parentBlog)
//                     throw `blog with ID: ${correctPost.blogId} doesn't exist`;
//                 foundPost.blogName = parentBlog.name; 
//             }
//             catch(error){
//                 console.log(error);
//                 foundPost.blogName = "blog  doesn't exist";
    
//             }
//         }
        
//         return true;
//     },

// // deletes all posts from base
//     async clear(): Promise < boolean > {
//         db.posts = [];
//         return true;
//     },

// // returns list of all posts 
//     async view(): Promise <PostViewModel[]> {
//         const posts: PostViewModel[] = db.posts;
//         return posts;
//     }
 
// }