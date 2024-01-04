import { EntityRepository, getRepository, Repository } from "typeorm";
import { appsettings } from "../../config/appsettings";
import GenResponse, { StatusCode } from "../../config/GenResponse";
import { IUser } from "./interfaces/IUser";
import UserTypeDto from "./models/User.types";
import User from "./entity/user.entity";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserVariables from "./user.variables";
import { JwtBuilder, nameOfFactory } from "../../middleware/utils";
import { IUserLogin, IUserRegistration } from "./interfaces/IUserRegistration";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    RegisterUser = async (user: IUserRegistration): Promise<GenResponse<IUser | string | null>> => {
        let objResp: GenResponse<IUser | string | null> = new GenResponse();
        try {
            const isUserValid = await this._IsUserContentCheck(user);
            if (!isUserValid.IsSuccess) {
                return isUserValid;
            }
            const usersRepo = this._GetRepo();
            // check if user exists
            const userExists = await usersRepo.findOne({ where: [{ username: user.username }, { email: user.email }] });
            if (userExists) {
                objResp = GenResponse.Result<IUser>({ username: user.username, email: user.email }, false, StatusCode.BadRequest, 'Username/email already exists.');
            } else {

                const { email, username, password, firstName, lastName } = user;
                const newUser = new User();
                Object.assign(newUser, user);
                newUser.password = await this._encryptContent(password!);

                const objSaved = await usersRepo.save<User>(newUser);
                if (objSaved) {
                    objResp = GenResponse.Result<string>(await JwtBuilder({ username, email, firstName, lastName }), true, StatusCode.Created, 'User account successfully created.');
                } else {
                    objResp = GenResponse.Result<IUser>({ username, email }, false, StatusCode.NotImplemented);
                }
            }
        } catch (error) {
            console.log(`[UserRepository][RegisterUser] ERROR:: ${error}`);
            objResp = GenResponse.Result<IUser | null>(null, false, StatusCode.ServerError, null);
        }
        return objResp;
    }


    GetAllUsers = async (): Promise<GenResponse<IUser[] | null>> => {
        let objResult: GenResponse<IUser[] | null>;
        try {
            const goalsRepo = getRepository(User);
            const allUsers = await goalsRepo.find({ where: { isDeactivated: 0 } })
            if (allUsers && allUsers.length > 0) {
                objResult = GenResponse.Result<IUser[]>(allUsers, true, StatusCode.OK, allUsers.length.toString());
            }
            else {
                objResult = GenResponse.Result<IUser[] | null>(null, false, StatusCode.BadRequest);
            }
        } catch (error) {
            console.log(`[UserRepository][GetAllUsers] ERROR:: ${error}`);
            objResult = GenResponse.Result<IUser[] | null>(null, false, StatusCode.ServerError);
        }
        return objResult;
    }

    GetUserByUsername = async (username: string): Promise<GenResponse<IUser | null>> => {
        let objResult: GenResponse<IUser | null>;
        const nameOf = nameOfFactory<User>();
        try {
            const user = await this.createQueryBuilder(UserVariables.TableName).select([
                `${UserVariables.TableName}.username`,
                `${UserVariables.TableName}.${nameOf('email')}`,
                `${UserVariables.TableName}.${nameOf('firstName')}`,
                `${UserVariables.TableName}.${nameOf('lastName')}`,
            ]).where(`username = :username OR email = :email`, { username, email: username }).limit(1).getOne();
            if (user) {
                objResult = GenResponse.Result<IUser>(user, true, StatusCode.OK);
            }
            else {
                objResult = GenResponse.Result<IUser | null>(null, false, StatusCode.BadRequest);
            }
        } catch (error) {
            console.log(`[UserRepository][GetUserByUsername] ERROR:: ${error}`);
            objResult = GenResponse.Result<IUser | null>(null, false, StatusCode.ServerError);
        }
        return objResult;
    }

    LoginUser = async (user: IUserLogin): Promise<GenResponse<IUser | string | null>> => {
        let objResp: GenResponse<string | null> = new GenResponse();
        try {
            const isValidObj = await this._IsUserContentCheck(user);
            if (!isValidObj.IsSuccess) {
                return isValidObj;
            }
            const { username } = user;
            const result = await this.createQueryBuilder(UserVariables.TableName)
                .select([`${UserVariables.TableName}.username`, `${UserVariables.TableName}.email`, `${UserVariables.TableName}.password`])
                .where(`(${UserVariables.TableName}.username = :username OR ${UserVariables.TableName}.email = :email)`, { username: user.username, email: username })
                .getOne();
            if (result && (await bcrypt.compare(user.password!, result.password))) {
                objResp = GenResponse.Result<string>(await JwtBuilder({ username, email: user.username }), true, StatusCode.OK);
            } else {
                objResp = GenResponse.Result<null>(null, false, StatusCode.NotFound, 'Username/email not found.');
            }
        } catch (error) {
            console.log(`[UserRepository][LoginUser] ERROR:: ${error}`);
            objResp = GenResponse.Result<string | null>(null, false, StatusCode.ServerError, 'An error occured. Kindly try again.');
        }
        return objResp;
    }


    _IsUserContentCheck = async (user: UserTypeDto | IUserLogin): Promise<GenResponse<IUser | null>> => {
        let isGoalValid: GenResponse<IUser | null>;
        if (user === null || user === undefined || !user.username || (!user.password || user.password.length < appsettings.GoalsConfig.minGoalsLength)) {
            isGoalValid = GenResponse.Result<IUser | null>(null, false, StatusCode.BadRequest, `All fields are required.`);
        } else {
            isGoalValid = GenResponse.Result<IUser | null>(null, true, StatusCode.OK, `User entries are valid.`);
        }
        return isGoalValid;
    }

    _IsUserRegistrationCheck = async (user: UserTypeDto): Promise<GenResponse<IUser | null>> => {
        let isGoalValid: GenResponse<IUser | null>;
        if (user === null || user === undefined || !user.username || (!user.password || user.password.length < appsettings.GoalsConfig.minGoalsLength)) {
            isGoalValid = GenResponse.Result<IUser | null>(null, false, StatusCode.BadRequest, `All fields are required.`);
        } else {
            isGoalValid = GenResponse.Result<IUser | null>(null, true, StatusCode.OK, `User entries are valid.`);
        }
        return isGoalValid;
    }

    _GetRepo = (): Repository<User> => getRepository(User);

    _encryptContent = async (value: string): Promise<string> => {
        const salt = await bcrypt.genSalt(appsettings.encryption.length);
        const encryptedContent = await bcrypt.hash(value, salt);
        return encryptedContent;
    }
}