import { CodStatus, StatusResult } from "../../../types/interfaces";
import { postRepository } from "../../posts/repositories/postRepository";
import { userQueryRepository } from "../../users/repositories/user.query.repository";
import { commentRepository } from "../repositories/commentRepository"; 
import { CommentFullType, CommentInputType} from "../types";

export const commentService = {

    async create(parentPostId: string, userId: string, createItem: CommentInputType ): Promise < StatusResult<string|undefined>>{ 

        const checkPost: StatusResult = await postRepository.isExist(parentPostId)
        if(checkPost.codResult == CodStatus.NotFound){
            return checkPost;
        }

        const userLogin: string = (await userQueryRepository.findById(userId))!.login
        const newComment: Omit<CommentFullType, 'id'> = {
                                content: createItem.content,
                                parentPostId: parentPostId,
                                commentatorInfo: { userId: userId,
                                                   userLogin: userLogin},
                                createdAt: new Date(),
                            }
        return await commentRepository.create(newComment)

    },
 
    async edit(id: string, userId: string, editData: CommentInputType): Promise < StatusResult >{    
       
        const oldComment: StatusResult<CommentFullType | undefined> = await commentRepository.findById(id)
       
        if(oldComment.codResult == CodStatus.NotFound)
            return oldComment as StatusResult

        if(oldComment.data!.commentatorInfo.userId != userId)
            return {codResult: CodStatus.Forbidden}       

        return await commentRepository.edit(id, editData);         
    },

   async delete(id: string, userId: string): Promise < StatusResult > {     

        const foundResult: StatusResult<CommentFullType | undefined> = await commentRepository.findById(id)

        if (foundResult.codResult != CodStatus.Ok )
            return foundResult as StatusResult;

        if(foundResult.data!.commentatorInfo.userId != userId)
            return {codResult: CodStatus.Forbidden}       

        return await commentRepository.delete(id);
    },

    async clear(): Promise < StatusResult > {
        return await commentRepository.clear()
    },
}