import { LogType } from "../modules/common/enums/log-type.enum";
import { format } from "date-fns";
import { NextFunction, Request, Response } from "express";

export const ConsoleLog = (
  message: string,
  logType: LogType = LogType.Log
): void => {
  let color = "\x1b[33m%s\x1b[0m"; // Default is yellow
  switch (logType) {
    case LogType.Log:
      console.log("\x1b[33m%s\x1b[0m", message);
      return;
    case LogType.Info:
      console.log("\x1b[32m", message);
      return;
    case LogType.Exception:
      console.log("\x1b[1;31m", message);
      return;
    default:
      console.log("\x1b[33m%s\x1b[0m", message);
      return;
  }
};

export const PoweredBy = (req: Request, resp: Response, next: NextFunction) => {
  resp.header({
    "x-powered-by": "PHP",
    author: "Onadebi",
  });
  ConsoleLog(
    `[${format(new Date(), "yyyy-MM-dd hh:mm:ss")}] Requested path is:: [${
      req.method
    }] ${req.url} | ${resp.statusCode}`
  );
  next();
};
