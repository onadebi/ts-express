import { Request, NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';
import { getCustomRepository } from "typeorm";
import { IUser } from "../applications/users/interfaces/IUser";
import Users from "../applications/users/users.model";
import { UserRepository } from "../applications/users/users.service";
import { appsettings } from "../config/appsettings";
import GenResponse, { StatusCode } from "../config/GenResponse";

export const AuthMidware =async (req: Request, resp: Response, next:NextFunction)=>{
    let token = req.headers.authorization;
    if(!token || !token.startsWith('Bearer')) return resp.status(StatusCode.Unauthorized).send(GenResponse.Result<null>(null,false,StatusCode.Unauthorized,'Access denied'));
    try {
        token = token.split(' ')[1];
        const verified = jwt.verify(token,appsettings.encryption.secreteKey!) as IUser;
        console.log(`VERIFIED Credentials is >>> ${JSON.stringify(verified)}`)
        req.body.user = await (await getCustomRepository(UserRepository).GetUserByUsername(verified.username)).Data;
        console.log(`info from AuthMidWare >> `,JSON.stringify(req.body.user,null,2))
        next();
    } catch (errr) {
        resp.status(StatusCode.Unauthorized).send(GenResponse.Result<null>(null,false,StatusCode.Unauthorized,'Invalid token'));    
    }
}