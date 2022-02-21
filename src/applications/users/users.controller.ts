import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../users/models/User';
import Users from '../users/models/User';

const usersRoute = express.Router()


usersRoute.get('/',async (req:Request, resp: Response)=>{
    
    const userRepo = getRepository(User);
    
    const user = new Users();
    user.firstName = "Onaxsys";
    user.lastName = "Edebi";
    user.age = 30;
    await userRepo.save(user);

    const allUsers = await userRepo.find();
    resp.status(200).json(allUsers);
})
.post('/', (req:Request, resp: Response)=>{
    resp.status(200).json({message: 'Create user'});
});


usersRoute.get('/:id', (req:Request<{id: string}>, resp: Response)=>{
    const id = req.params.id;
    resp.status(200).json({message: `Get user of id ${id}`});
})
.put('/:id', (req:Request, resp: Response)=>{
    resp.status(200).json({message: 'Update user '+ req.params.id});
})
.delete('/:id', (req:Request, resp: Response)=>{
    const id = req.params.id;  
    resp.status(200).json({message: `Delete user of id ${id}`});
});

export default usersRoute;