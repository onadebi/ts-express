import { EntityRepository, getRepository, Repository } from "typeorm";
import { appsettings } from "../../config/appsettings";
import GenResponse, { StatusCode } from "../../config/GenResponse";
import { IUser } from "./interfaces/IUser";
import UserTypeDto from "./models/User.types";
import Users from "./users.model";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

@EntityRepository(Users)
export class UserRepository extends Repository<Users>{

    RegisterUser = async (user: UserTypeDto): Promise<GenResponse<IUser|null>> =>{
        let objResp: GenResponse<IUser|null> = new GenResponse();
        try {
            const isUserValid = await this._IsUserContentCheck(user);
            if(!isUserValid.IsSuccess){
                return isUserValid;
            }
            const usersRepo = this._GetRepo();
            // check if user exists
            const userExists= await usersRepo.findOne({where: {username: user.username, email: user.email}});
            if(userExists){
                return GenResponse.Result<IUser>({username: user.username, email: user.email},false,StatusCode.NoChanges,'Username/email already exists.');
            }
            const {email,username, password} = user;
            const newUser = new Users();
            newUser.username = username;
            newUser.email=email;
            newUser.password = await this._encryptContent(password!);

            const objSaved = await usersRepo.save<Users>(newUser);
            if(objSaved){
                objResp = GenResponse.Result<IUser>({username, email}, true, StatusCode.Created,'User accoutn successfully created.');
            }else{
                objResp = GenResponse.Result<IUser>({username, email}, false, StatusCode.NotImplemented);
            }
        } catch (error) {
            console.log(`[UserRepository][RegisterUser] ERROR:: ${error}`);
            objResp = GenResponse.Result<IUser|null>(null, false,StatusCode.ServerError,null);
        }
        return objResp;
    }



    _IsUserContentCheck = async(user: UserTypeDto): Promise<GenResponse<IUser|null>> =>{
        let isGoalValid :GenResponse<IUser|null>;
        if(user === null || user === undefined || !user.username || user.password.length < appsettings.GoalsConfig.minGoalsLength){
            isGoalValid = GenResponse.Result<IUser|null>(null,false, StatusCode.BadRequest,`Username field is required.`);
        }else{
            isGoalValid = GenResponse.Result<IUser|null>(null,true, StatusCode.OK,`Goal is valid`);
        }
        return isGoalValid;
    }

    _GetRepo(): Repository<Users> {
        return getRepository(Users);
    }

    _encryptContent =async(value:string): Promise<string> =>{
        const salt = await bcrypt.genSalt(appsettings.encryption.length);
        const encryptedContent =await bcrypt.hash(value,salt);
        return encryptedContent;
    }
}