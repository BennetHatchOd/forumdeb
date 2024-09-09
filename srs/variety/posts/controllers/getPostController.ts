import {Response, Request } from "express";
import {HTTP_STATUSES} from '../../../setting';
import { postRepository } from "../repositories/index";
import {PostViewModel} from '../../../types';

export const getPostController = async (req: Request, res: Response<PostViewModel[]>) =>{
    const posts = await postRepository.view();
    res.status(HTTP_STATUSES.OK_200).json(posts);

}
