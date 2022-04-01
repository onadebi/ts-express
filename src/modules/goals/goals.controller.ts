import express, { Request, Response } from 'express';
import { Connection, getCustomRepository } from 'typeorm';
import { IUser } from '../users/interfaces/IUser';
import { GoalsRepository } from './goals.service';
import { CreateGoal } from './interfaces/create-goal';
import IGoal from './interfaces/IGoal';
const goalRouter = express.Router()

function GetRepo() : GoalsRepository{
    return getCustomRepository(GoalsRepository);
}

type GoalType ={
    id: number;
    text: string;
}

/**
   * @openapi
   * /api/goals:
   *  get:
   *     tags:
   *     - Goals
   *     description: Provides user goals
   *     responses:
   *       200:
   *         description: Valid response of goals
   */
goalRouter.get('/',async (req:Request, resp: Response)=>{
    const user: IUser = req.body.user;
    const allGoals = await GetRepo().GetAllGoals();
    resp.status(allGoals.StatusCode).json(allGoals);
})

/**
   * @openapi
   * /api/goals:
   *  post:
   *     tags:
   *     - Goals
   *     description: Create a user goal
   *     responses:
   *       200:
   *         description: Valid response of created goal
   */
.post('/', async (req:Request<any,any, CreateGoal | any,any>, resp: Response)=>{
    const goal = req.body;
    const user: IUser = req.body.user;
    const objResult = await getCustomRepository(GoalsRepository).CreateGoal(goal);
    return resp.status(objResult.StatusCode).json(objResult);
});


goalRouter.get('/:id', async (req:Request<{id: string}>, resp: Response)=>{
    const goal = await GetRepo().GetGoalById(Number(req.params.id));
    resp.status(goal.StatusCode).json(goal);
})
.put('/:id', async (req: Request<{id: number},any,IGoal, any>, resp: Response)=>{
    console.log(req.body)
    const goalUpdate = await GetRepo().UpdateGoal(req.body,req.params.id)
    resp.status(goalUpdate.StatusCode).json(goalUpdate);
})
.delete('/:id', async (req:Request<{id: number},any,IGoal, any>, resp: Response)=>{
    const id = req.params.id;
    const goalResp = await GetRepo().RemoveGoal(req.params.id)
    resp.status(goalResp.StatusCode).json(goalResp);
});

export default goalRouter;