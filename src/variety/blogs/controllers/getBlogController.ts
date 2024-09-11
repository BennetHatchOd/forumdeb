import { Response, Request } from "express";
import {HTTP_STATUSES} from '../../../setting';
import {BlogViewModel} from '../../../types';
import { blogService } from "../blogSevice";

export const getBlogController = async (req: Request, res: Response<BlogViewModel []>) =>{
    const blogs: BlogViewModel[] = await blogService.view();
    res.status(HTTP_STATUSES.OK_200).json(blogs);

}
