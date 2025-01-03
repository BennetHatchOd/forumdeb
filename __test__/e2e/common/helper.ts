import { DeviceViewType } from "../../../src/variety/devices/types";

export function compareArr(arr1: Array<string>, arr2: Array<DeviceViewType>){
    let deviceNamesSource: Array<DeviceViewType> = arr2
    let deviceNames = deviceNamesSource.map(s => s.title)
    const check = arr1.reduce((acc, current)=>{acc += deviceNames.includes(current)
                                                        ? 1
                                                        : 0;
                                                    return acc }, 0)
    return check                    
        }