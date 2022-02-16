import { Request, Response, NextFunction } from "express";

export const PoweredBy = (req: Request, resp: Response, next: NextFunction) => {
  resp.header({
    "x-powered-by": "PHP",
    author: "ONADEBI",
  }),
    next();
};
