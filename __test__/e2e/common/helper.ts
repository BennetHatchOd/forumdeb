import { DeviceViewModel } from "../../../src/variety/devices/types";

export function compareArr(arr1: Array<string>, arr2: Array<DeviceViewModel>){
    let deviceNamesSource: Array<DeviceViewModel> = arr2
    let deviceNames = deviceNamesSource.map(s => s.title)
    const check = arr1.reduce((acc, current)=>{acc += deviceNames.includes(current)
                                                        ? 1
                                                        : 0;
                                                    return acc }, 0)
    return check                    
        }