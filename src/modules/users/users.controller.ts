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


/**
 * @openapi
 * components:
 *   schemas:
 *     IUserLogin:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - username
 *         - password
 *
 * /api/users/login:
 *  post:
 *     tags:
 *     - User
 *     description: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IUserLogin'
 *     responses:
 *       200:
 *         description: Valid response of login
 *       404:
 *         description: User not found
 */
usersRoute.post('/login',async (req: Request<any,any,IUserLogin>,res)=>{
    const objResp = await GetRepo().LoginUser(req.body);
    res.status(objResp.StatusCode).json(objResp)
});

/**
 * @openapi
 * /api/users/{me}:
 *  get:
 *     tags:
 *      - User
 *     description: Retrieves the current user
 *     parameters:
 *       - in: path
 *         name: me
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the current user
 *     responses:
 *       200:
 *         description: Valid response of the current user
 */
usersRoute.get('/:me',AuthMidware, (req:Request<{me: string}>, resp: Response)=>{
    const me = req.params.me;
    const { username, email, firstName} = req.body.user;
    resp.status(200).json({message: `Get user of id ${username} | ${email} | ${firstName}`});
})

export default usersRoute;