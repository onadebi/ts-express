import { Request, Response, NextFunction } from "express";

export const PoweredBy = (req: Request, resp: Response, next: NextFunction) => {
  resp.locals.name = "Ts-Express!";
  resp.header({
    "x-powered-by": "PHP",
    author: "Onadebi",
  });
  console.log(`Calling path is: [${req.method}] ${req.url}`);
  next();
};
