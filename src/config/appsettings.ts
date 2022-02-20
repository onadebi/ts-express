import dotenv from 'dotenv';
dotenv.config();

export const appsettings ={
    PORT: process.env.PORT,
    node_env: process.env.NODE_ENV
}