import mongoose, { HydratedDocument, Model, model } from "mongoose";
import * as SETTING from "../../../setting"



export type RequestAPIType = {
    ip:     string, 
    url:    string, 
    date:   Date
}

type RequestModel = Model<RequestAPIType>
export type RequestDocument = HydratedDocument<RequestAPIType>

const requestSchema = new mongoose.Schema<RequestAPIType>({
    ip:	    { type: String, required: true },
    url:	{ type: String, required: true },
    date:	{ type: Date, required: true }
  });
  
  export const RequestModel = model<RequestAPIType, RequestDocument>(SETTING.REQUEST_COLLECTION_NAME, requestSchema);