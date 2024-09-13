import {Response, Request } from "express";
import {HTTP_STATUSES} from '../../../setting';
import { postRepository } from "../repositories/postRepository";
import {PostViewModel} from '../../../types';
import { postService } from "../postService";

export const getPostController = async (req: Request, res: Response<PostViewModel[]>) =>{
    const posts = await postService.view();
    res.status(HTTP_STATUSES.OK_200).json(posts);

}
