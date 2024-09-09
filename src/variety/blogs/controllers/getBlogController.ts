import { Response, Request } from "express";
import {HTTP_STATUSES} from '../../../setting';
import {BlogViewModel} from '../../../types';
import { blogRepository } from "../repositories/index";

export const getBlogController = async (req: Request, res: Response<BlogViewModel []>) =>{
    const blogs: BlogViewModel[] = await blogRepository.view();
    res.status(HTTP_STATUSES.OK_200).json(blogs);

}
