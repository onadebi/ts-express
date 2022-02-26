import { ok } from "assert";

class GenResponse<T>{
    IsSuccess: boolean;
    Data: T| undefined| null;
    Message: string | null;
    StatusCode: StatusCode;

    constructor(){
        this.IsSuccess = false;
        this.Message = '';
        this.StatusCode = 200;
    }

    static Result<T>(objVal: T,isSuccess: boolean = false, statusCode: StatusCode = StatusCode.OK, message: string|null = ''):GenResponse<T>{
        const objResp = new GenResponse<T>();
        
        objResp.Data = objVal;
        objResp.IsSuccess = isSuccess;
        objResp.Message = message;
        objResp.StatusCode = statusCode;
        
        return objResp;
    }
}


export enum StatusCode{
    OK = 200,
    Created=201,
    // NoChanges=304,
    BadRequest=400,
    Unauthorized=401,
    Forbidden=403,
    NotFound = 404,
    UnAvailableForLegalReasons=451,
    ServerError=500,
    NotImplemented=501,
    ServiceNotAvailable=503,
    GatewayTimeout=504,
    InsufficientStorage=507
}


export default GenResponse;