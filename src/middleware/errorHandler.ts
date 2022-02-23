import { NextFunction, Request, Response } from "express";
import ApplicationVariables from "../config/application.variables";
import { appsettings } from "../config/appsettings";
import GenResponse from "../config/GenResponse";

const ErrorHandler = (error: Error, req: Request, resp: Response<{message: string, stacktrace?: string|null}>, next: NextFunction)=>{
    const statusCode = resp.statusCode ? resp.statusCode : 500;

    resp.status(statusCode).json({
        message: error.message,
        stacktrace: appsettings.node_env === ApplicationVariables.environment_prod ? null :error.stack 
    });

    next();
}

export const GenResponseHandler = (error: Error, req: Request, resp: Response, next: NextFunction)=>{
    // For global response interceptor
    resp.status(200).json({
        message: error.message,
        stacktrace: appsettings.node_env === ApplicationVariables.environment_prod ? null :error.stack 
    });
    
    next();
}


export default ErrorHandler;