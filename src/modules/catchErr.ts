import { error } from "console";
import { CodStatus, StatusResult } from "../interfaces";

export const catchErr = (err: any) => {
    
    console.log(err)

    let answer: StatusResult = {
                codResult: CodStatus.Error
            }
    if (err instanceof Error)
        answer.error = err;
    
    answer.message = (typeof err == 'string') 
                    ? err 
                    : 'unknown error'

    return answer;
}
