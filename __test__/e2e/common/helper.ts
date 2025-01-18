import request from "supertest";
import { app } from "../../../src/app";
import { HTTP_STATUSES, URL_PATH } from "../../../src/setting/setting.path.name";
import { DeviceViewType } from "../../../src/variety/devices/types";
import { CommentViewType, LikesCommentType, LikesCommentViewType } from "../../../src/variety/comments/types";

export function compareArr(arr1: Array<string>, arr2: Array<DeviceViewType>){
    let deviceNamesSource: Array<DeviceViewType> = arr2
    let deviceNames = deviceNamesSource.map(s => s.title)
    const check = arr1.reduce((acc, current)=>{acc += deviceNames.includes(current)
                                                        ? 1
                                                        : 0;
                                                    return acc }, 0)
    return check                    
        }

export async function checkCommentLike(commentsId: string, accessToken: string, likeStatus: string): Promise<LikesCommentViewType & {myStatus:string}>{

            await request(app).put(`${URL_PATH.comments}/${commentsId}/like-status`)
                        .set("Authorization", 'Bearer ' + accessToken)
                        .send({likeStatus: likeStatus })
                        .expect(HTTP_STATUSES.NO_CONTENT_204);
           
            let commentResponce = await request(app)
                                        .get(`${URL_PATH.comments}/${commentsId}`)
                                        .set("Authorization", 'Bearer ' + accessToken)
                                        .expect(HTTP_STATUSES.OK_200);
            let comment = commentResponce.body
              
            return mapLikesInfo(comment)
}

export function mapLikesInfo(comment: CommentViewType){
    return {...comment.likesInfo, myStatus: comment.myStatus}
}