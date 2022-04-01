import express, { Request, Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import GenResponse from '../../config/GenResponse';
import { AuthMidware } from '../../middleware/auth.middleware';
import { IUserLogin, IUserRegistration } from './interfaces/IUserRegistration';
import UserTypeDto from './models/User.types';
import User from './entity/user.entity';
import { UserRepository } from './users.service';


const usersRoute = express.Router()

function GetRepo() : UserRepository{
    return getCustomRepository(UserRepository);
}


/**
   * @openapi
   * /api/users:
   *  get:
   *     tags:
   *     - User
   *     description: Retrieves all users
   *     responses:
   *       200:
   *         description: Valid response of goals
   */
usersRoute.get('/',async (req:Request, resp: Response)=>{
    const allUsers = await GetRepo().GetAllUsers();
    resp.status(allUsers.StatusCode).json(allUsers);
}); 

// usersRoute.get('/:username',async (req:Request, resp: Response)=>{
//     const user = await GetRepo().GetUserByUsername(req.params.username);
//     resp.status(user.StatusCode).json(user);
// }); 

/**
   * @openapi
   * /api/users:
   *  post:
   *     tags:
   *     - User
   *     description: Retrieves all users
   *     responses:
   *       200:
   *         description: Valid response of goals
   */
usersRoute.post('/register', async (req:Request<any,any,IUserRegistration,any>, resp: Response)=>{
    const newUser = await GetRepo().RegisterUser(req.body);
    return resp.status(newUser.StatusCode).json(newUser);
});


usersRoute.post('/login',async (req: Request<any,any,IUserLogin>,res)=>{
    const objResp = await GetRepo().LoginUser(req.body);
    res.status(objResp.StatusCode).json(objResp)
});


usersRoute.get('/:me',AuthMidware, (req:Request<{me: string}>, resp: Response)=>{
    const me = req.params.me;
    const { username, email, firstName} = req.body.user;
    resp.status(200).json({message: `Get user of id ${username} | ${email} | ${firstName}`});
})

export default usersRoute;