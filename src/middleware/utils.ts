import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { appsettings } from "../config/appsettings";

export const PoweredBy = (req: Request, resp: Response, next: NextFunction) => {
  resp.locals.name = "Ts-Express!";
  resp.header({
    "x-powered-by": "PHP",
    author: "Onadebi",
  });
  console.log(`Calling path is: [${req.method}] ${req.url}`);
  next();
};


export const JwtBuilder = async(obj: {}): Promise<string>=>{
  return jwt.sign(obj,appsettings.encryption.secreteKey!,{
    expiresIn: '15m'
  });
}

export const nameOfFactory = <T>()=> (name: keyof T)=> name;