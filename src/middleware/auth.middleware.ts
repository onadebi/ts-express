import { Request, NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';
import { getCustomRepository } from "typeorm";
import { IUser } from "../applications/users/interfaces/IUser";
import Users from "../applications/users/users.model";
import { UserRepository } from "../applications/users/users.service";
import { appsettings } from "../config/appsettings";

export const AuthMidware =async (req: Request, resp: Response, next:NextFunction)=>{
    let token = req.headers.authorization;
    if(!token || !token.startsWith('Bearer')) return resp.status(401).send('Access denied');
    try {
        token = token.split(' ')[1];
        const verified = jwt.verify(token,appsettings.encryption.secreteKey!) as IUser;
        console.log(`VERIFIED Credentials is >>> ${JSON.stringify(verified)}`)
        req.body.user = await getCustomRepository(UserRepository).GetUserByUsername(verified.username);
        next();
    } catch (errr) {
        resp.status(501).send('Invalid token');    
    }
}