import express from 'express';

const routes = express.Router();


routes.get('/',(req,resp)=>{
    
    resp.send('Router response');
})

export default routes;