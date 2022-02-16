import express, { Router } from "express";

const routes = express.Router();

routes.get("/", (req, resp) => {
  resp.send("Router response");
});

routes.get("/err", (req, res) => {
  throw new Error();
});

export default routes;
