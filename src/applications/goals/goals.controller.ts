import express, { Request, Response } from 'express';

const goalRouter = express.Router()


goalRouter.get('/', (req:Request, resp: Response)=>{
    resp.status(200).json({message: 'Get goals'});
})
.post('/', (req:Request, resp: Response)=>{
    resp.status(200).json({message: 'Create goal'});
});


goalRouter.get('/:id', (req:Request<{id: string}>, resp: Response)=>{
    const id = req.params.id; 
    throw new Error('please add valid goal id')
    resp.status(200).json({message: `Get goal of id ${id}`});
})
.put('/:id', (req:Request, resp: Response)=>{
    resp.status(200).json({message: 'Update goal '+ req.params.id});
})
.delete('/:id', (req:Request, resp: Response)=>{
    const id = req.params.id;  
    resp.status(200).json({message: `Delete goal of id ${id}`});
});

export default goalRouter;