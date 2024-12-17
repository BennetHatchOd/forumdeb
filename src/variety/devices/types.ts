export type DeviceViewModel = {
    ip:             string,
    title:          string,
    lastActiveDate: string,
    deviceId:       string
  }

  export type activeSessionModel = {
    id:         string,
    userId:     string,
    version:    string,
    deviceId:   string,
    deviceName: string,
    ip:         string,
    createdAt:  Date,
    expiresAt:  Date
}

// export type payloadFromSessionModel = {
//   id:         string,
//   userId:     string,
//   version:    string,
//   deviceId:   string,
//   iat:        number,
//   exp:        number
// }

export type updateSessionModel = {
  userId:     string,
  version:    string,
  deviceId:   string,
  createdAt:  Date,
  expiresAt:  Date
}

