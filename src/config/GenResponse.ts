class GenResponse<T>{
    IsSuccess: boolean;
    Data: T| undefined| null;
    Message: string;

    constructor(){
        this.IsSuccess = false;
        this.Message = '';
    }

    static Result<T>(objVal: T,isSuccess: boolean, message: string = ''):GenResponse<T>{
        const objResp = new GenResponse<T>();
        
        objResp.IsSuccess = isSuccess;
        objResp.Data = objVal;
        objResp.Message = message;
        
        return objResp;
    }
}

export default GenResponse;