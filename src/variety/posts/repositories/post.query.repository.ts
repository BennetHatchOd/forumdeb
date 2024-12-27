import { QueryType, PaginatorType} from "../../../types/types";
import { ObjectId } from "mongodb";
import { emptyPaginator } from "../../../utility/paginator";
import { PostViewType } from "../types";
import { PostDocument, PostModel } from "../domain/post.entity";

export class PostQueryRepository {

 
    async findById(id: string): Promise < PostViewType | null > {      
        
        if(!ObjectId.isValid(id))
            return null;
        const searchItem: PostDocument | null = 
            await PostModel.findOne({_id: new ObjectId(id)})
        
        return searchItem 
            ? this.mapDbToOutput(searchItem) 
            : null;
    }

    async find(queryReq:  QueryType): Promise < PaginatorType<PostViewType> > { 
        
        const bloqIdSearch = queryReq.blogId ? {blogId: queryReq.blogId} : {}   
        const queryFilter = {...bloqIdSearch}
        
        const totalCount: number= await PostModel.countDocuments(queryFilter)   
        
        if (totalCount == 0)
            return emptyPaginator;
        
        const query = PostModel.find(queryFilter)
                                .limit(queryReq.pageSize)
                                .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
                                .sort({[queryReq.sortBy]: queryReq.sortDirection})

        const searchItem = await query.exec() 

        const pagesCount =  Math.ceil(totalCount / queryReq.pageSize) 
        return {
                pagesCount: pagesCount,
                page: queryReq.pageNumber > pagesCount ? pagesCount : queryReq.pageNumber,
                pageSize: queryReq.pageSize,
                totalCount: totalCount,
                items: searchItem.map(s => this.mapDbToOutput(s))
            } 
 

    }

    mapDbToOutput(item: PostDocument): PostViewType {
        
        return { 
            id: item._id.toString(),
            title:	item.title,
            shortDescription: item.shortDescription,
            content: item.content,
            createdAt: item.createdAt.toISOString(),
            blogId:	item.blogId,
            blogName:	item.blogName
        }       
    }
 
}
 