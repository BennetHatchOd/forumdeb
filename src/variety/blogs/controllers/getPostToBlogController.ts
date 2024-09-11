import { Request, Response } from 'express'
import { postCollection } from '../../../db/db'
import { ObjectId } from 'mongodb'
import { postRepository } from '../../posts/repositories/postRepository'
export const getPostToBlogController = async(req: Request<{id: string}>, res: Response) => {

    //let index = postRepository.findMany(id,)
}