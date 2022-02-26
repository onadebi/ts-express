import express from "express";
import fs from "fs";
import path from "path";
import goalRouter from "../applications/goals/goals.controller";
import usersRoute from "../applications/users/users.controller";
import { AuthMidware } from "../middleware/auth.middleware";

async function ExtractReadMe(): Promise<string> {
  let content = new Promise<string>(async (resolve, reject) => {
    fs.readFile(
      path.join(__dirname, "../../ReadMe.md"),
      {
        encoding: "utf-8",
      },
      (err, data: string) => {
        if (err) {
          return reject("Unable to read file");
          console.log(err);
        } else {
          return resolve(data);
          console.log(data);
        }
      }
    );
  });
  return content;
}

const routes = express.Router();

routes.get("/", async (req, resp) => {
  ExtractReadMe()
    .then((data) => resp.send(`Router response from ReadMe.md>> ${data}`))
    .catch((err) => resp.status(404).send(`Router response: ${err}`));
});

routes.get("/err", (req, res) => {
  throw new Error();
});

routes.use('/api/goals',AuthMidware, goalRouter);
routes.use('/api/users', usersRoute);

export default routes;
