// import { BlogViewModel, BlogInputModel } from "../../../types";
// import {db} from "../../../db/dbArray"

// export const blogRepositoryArray = {

//  // searches for a blog by id and returns the blog or null
//     async find(id: string): Promise < BlogViewModel | null > {
//         const searchItem: BlogViewModel = db.blogs.find(c => c.id === id)
        
//     if(!searchItem) 
//         return null;

//     return searchItem;
//     },
 
// // creates new blog and returns this blog    
//     async create(createItem: BlogInputModel): Promise < BlogViewModel>{

//         let today = new Date();
//         const id = today.getHours() * 1000000000 + today.getMinutes() * 1000000 + today.getSeconds() * 1000 + today.getMilliseconds();
      
//         const newBlog: BlogViewModel = {
//           id: id.toString(),
//           name: createItem.name,
//           description: createItem.description,
//           websiteUrl: createItem.websiteUrl
//         }           
//         db.blogs.push(newBlog); //Promise
//         return newBlog;
//     },


// // deletes a blog by Id, returns true if the blog existed   
//     async delete(id: string): Promise < boolean > { 
//         if(db.blogs.findIndex(n => n.id === id) == -1)
//             return false;
//         db.blogs = db.blogs.filter(n => n.id !== id);
//         return true;
//     },

// // edits a blog by ID, if the blog is not found returns false    
//     async edit(id: string, correctBlog: BlogInputModel): Promise < boolean >{
//         const foundBlog: BlogViewModel = db.blogs.find(c => c.id === id);
//         if(!foundBlog)
//             return false;

//         foundBlog.name = correctBlog.name;
//         foundBlog.description = correctBlog.description;
//         foundBlog.websiteUrl = correctBlog.websiteUrl; 
//         return true;
//     },

// // deletes all blogs from base
//     async clear(): Promise < boolean > {
//         db.blogs = [];
//         return true;
//     },

// // returns list of all blogs    
//     async view(): Promise < BlogViewModel[] > {
//         const blogs: BlogViewModel[] = db.blogs;
//         return blogs;
//     }
 
// }
