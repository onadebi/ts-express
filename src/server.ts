import express, {Express, Request} from "express";
import cors from "cors";

const app = express();

export const server = (): Express => {
  app.use(cors());
  app.set("trust proxy", 1);
  app.set('server','PHP');
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  //Handle errors
  async function ThrowsError(){
      throw new Error('Error!!!');
  }

  app.get('/error',async (req: Request,res)=>{
      try{
        await ThrowsError();
      }catch(e){
        res.status(500).send('Something went wrong!');
      }
  })

  return app;
};
