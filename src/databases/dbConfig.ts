import "reflect-metadata";
import { createConnection } from "typeorm";
import Goals from "../applications/goals/goals.model";
import Users from "../applications/users/users.model";
import { appsettings } from "../config/appsettings";

export const dbConfig =() => createConnection({
    name:'default',
    type: "mysql",
    host: appsettings.db_connection.host,
    port: Number(appsettings.db_connection.port),
    username: appsettings.db_connection.username,
    password: appsettings.db_connection.password,
    database: appsettings.db_connection.database,
    entities: [
        Users, Goals
    ],
    synchronize: appsettings.db_connection.synchronize,
    logging: appsettings.db_connection.logging
}).then(connection => {
    console.log(`Connected to database on port ${appsettings.db_connection.port}`)
}).catch(error => console.log(error));