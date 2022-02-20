import { NextFunction, Request, Response } from "express";
import ApplicationVariables from "../config/application.variables";
import { appsettings } from "../config/appsettings";

const ErrorHandler = (error: Error, req: Request, resp: Response<{message: string, stacktrace?: string|null}>, next: NextFunction)=>{
    const statusCode = resp.statusCode ? resp.statusCode : 500;

    resp.status(statusCode).json({
        message: error.message,
        stacktrace: appsettings.node_env === ApplicationVariables.environment_prod ? null :error.stack 
    });
}

export default ErrorHandler;