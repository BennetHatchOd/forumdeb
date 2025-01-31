import { ObjectId } from "mongodb";

export function convertToObjectId(stringId: string|undefined): ObjectId|undefined|null{
    if(stringId === undefined)
        return undefined
    if(ObjectId.isValid(stringId))
        return new ObjectId(stringId)
    return null
}