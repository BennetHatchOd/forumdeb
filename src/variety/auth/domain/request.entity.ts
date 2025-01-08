import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { REQUEST_COLLECTION_NAME } from "../../../setting/setting.path.name";

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
  
  export const RequestModel = model<RequestAPIType, RequestModel>(REQUEST_COLLECTION_NAME, requestSchema);