import express, {Express, Request} from "express";
import cors from "cors";
import { dbConfig } from "./databases/dbConfig";
import { ConsoleLog } from "./utils/util-helper";
import { LogType } from "./modules/common/enums/log-type.enum";
import { client, SetToCache } from "./helpers/redisConfig";

dbConfig().catch(err=> ConsoleLog(`Server Error connecting to db`,LogType.Exception));

client.connect().then(()=> ConsoleLog(`Redis Cache connected successfully`))
.catch((error)=>ConsoleLog(`Redis Cache failed to connecty`,LogType.Exception));

SetToCache('goalzs', 'all goals',55)

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
