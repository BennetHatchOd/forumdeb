import request from "supertest";
import { app } from "../../../src/app";
import { HTTP_STATUSES, URL_PATH } from "../../../src/setting/setting.path.name";
import { DeviceViewType } from "../../../src/variety/devices/types";
import { CommentViewType} from "../../../src/variety/comments/types";
import { LikesEntityViewType } from "../../../src/variety/likes/types";
import { PostViewType } from "../../../src/variety/posts/types";

export function compareArr(arr1: Array<string>, arr2: Array<DeviceViewType>){
    let deviceNamesSource: Array<DeviceViewType> = arr2
    let deviceNames = deviceNamesSource.map(s => s.title)
    const check = arr1.reduce((acc, current)=>{acc += deviceNames.includes(current)
                                                        ? 1
                                                        : 0;
                                                    return acc }, 0)
    return check                    
        }

export async function setEntityLike(urlPath: string, entitiesId: string, accessToken: string, likeStatus: string): Promise<LikesEntityViewType & {myStatus:string}>{

    await request(app).put(`${urlPath}/${entitiesId}/like-status`)
                .set("Authorization", 'Bearer ' + accessToken)
                .send({likeStatus: likeStatus })
                .expect(HTTP_STATUSES.NO_CONTENT_204);
    
    let entityResponce = await request(app)
                                .get(`${urlPath}/${entitiesId}`)
                                .set("Authorization", 'Bearer ' + accessToken)
                                .expect(HTTP_STATUSES.OK_200);
    let entityInfo = entityResponce.body
    
    if (urlPath == URL_PATH.comments)
        return entityInfo.likesInfo 

    return entityInfo.extendedLikesInfo
}
