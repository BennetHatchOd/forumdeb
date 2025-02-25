import { CodStatus, StatusResult } from "../../../types/types";
import { Rating } from "../../likes/types";
import { PostRepository } from "../../posts/repositories/post.repository";
import { UserQueryRepository } from "../../users/repositories/user.query.repository";
import { CommentType } from "../domain/comment.entity";
import { CommentRepository } from "../repositories/comment.repository";
import { CommentInputType} from "../types";

export class CommentService {

    constructor(private postRepository: PostRepository,
                private userQueryRepository: UserQueryRepository,
                private commentRepository: CommentRepository){
    }

    async create(parentPostId: string, userId: string, createItem: CommentInputType ): Promise < StatusResult<string|undefined>>{ 

        const checkPost: boolean = await this.postRepository.isExist(parentPostId)
        if(!checkPost){
            return {codResult: CodStatus.NotFound};
        }
        
        const userLogin: string = (await this.userQueryRepository.findById(userId))!.login
        const newComment: CommentType = {
                                content: createItem.content,
                                parentPostId: parentPostId,
                                commentatorInfo: { userId: userId,
                                                   userLogin: userLogin},
                                createdAt: new Date(),
                                likesInfo:{
                                    likesCount: 0,
                                    dislikesCount: 0,
                                }
                            }
        return await this.commentRepository.create(newComment)

    }
 
    async edit(id: string, userId: string, editData: CommentInputType): Promise < StatusResult >{    
       
        const oldComment: StatusResult<CommentType | undefined> = await this.commentRepository.findById(id)
       
        if(oldComment.codResult == CodStatus.NotFound)
            return {codResult: CodStatus.NotFound}

        if(oldComment.data!.commentatorInfo.userId != userId)
            return {codResult: CodStatus.Forbidden}       

        return await this.commentRepository.edit(id, editData);         
    }

   async delete(id: string, userId: string): Promise < StatusResult > {     

        const foundResult: StatusResult<CommentType | undefined> = await this.commentRepository.findById(id)

        if (foundResult.codResult != CodStatus.Ok )
            return foundResult as StatusResult;

        if(foundResult.data!.commentatorInfo.userId != userId)
            return {codResult: CodStatus.Forbidden}       

        return await this.commentRepository.delete(id);
    }

    async clear(): Promise < StatusResult > {
        return await this.commentRepository.clear()
    }
}