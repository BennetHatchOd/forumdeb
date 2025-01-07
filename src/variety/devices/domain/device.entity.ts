import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { SESSION_COLLECTION_NAME } from "../../../setting/setting.path.name";


export type DeviceType = {
    userId:     string,
    version:    string,
    deviceId:   string,
    deviceName: string,
    ip:         string,
    createdAt:  Date,
    expiresAt:  Date
}

type DeviceModel = Model<DeviceType>
export type DeviceDocument = HydratedDocument<DeviceType>

const deviceSchema = new mongoose.Schema<DeviceType>({
    userId:     { type: String, required: true },
    version:    { type: String, required: true },
    deviceId:   { type: String, required: true },
    deviceName: { type: String, required: true },
    ip:         { type: String, required: true },
    createdAt:  { type: Date, required: true },
    expiresAt:  { type: Date, required: true },
  });
  
  export const DeviceModel = model<DeviceType, DeviceModel>(SESSION_COLLECTION_NAME, deviceSchema);