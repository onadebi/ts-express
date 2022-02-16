import express, {Express} from "express";
import cors from "cors";

const app = express();

export const server = (): Express => {
  app.use(cors());
  app.set("trust proxy", 1);
  app.set('server','PHP');
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));


  return app;
};
