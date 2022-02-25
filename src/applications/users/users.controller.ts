import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Users from './users.model';


const usersRoute = express.Router()


usersRoute.get('/',async (req:Request, resp: Response)=>{
    
    const userRepo = getRepository(Users);
    
    const user = new Users();
    user.firstName = "Onaxsys";
    user.lastName = "Edebi";
    user.email= 'onaefe@gmail.com';
    await userRepo.save(user);

    const allUsers = await userRepo.find();
    resp.status(200).json(allUsers);
})


usersRoute.get('/register', (req:Request, resp: Response)=>{
    resp.status(200).json({message: 'Create user'});
});


usersRoute.get('/login',(req,res)=>{
    res.json({'message': 'login'})
});


usersRoute.get('/:me', (req:Request<{me: string}>, resp: Response)=>{
    const me = req.params.me;
    resp.status(200).json({message: `Get user of id ${me}`});
})

export default usersRoute;