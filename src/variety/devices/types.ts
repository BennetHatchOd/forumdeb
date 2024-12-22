export type DeviceViewType = {
    ip:             string,
    title:          string,
    lastActiveDate: string,
    deviceId:       string
  }

  export type activeSessionType = {
    //id:         string,
    userId:     string,
    version:    string,
    deviceId:   string,
    deviceName: string,
    ip:         string,
    createdAt:  Date,
    expiresAt:  Date
}

// export type payloadFromSessionType = {
//   id:         string,
//   userId:     string,
//   version:    string,
//   deviceId:   string,
//   iat:        number,
//   exp:        number
// }

export type updateSessionType = {
  userId:     string,
  version:    string,
  deviceId:   string,
  createdAt:  Date,
  expiresAt:  Date
}

