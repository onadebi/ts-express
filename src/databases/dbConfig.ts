import "reflect-metadata";
import { createConnection } from "typeorm";
import Goal from "../modules/goals/entity/goal.entity";
import User from "../modules/users/entity/user.entity";
import { appsettings } from "../config/appsettings";
import { ConsoleLog } from "../utils/util-helper";
import { LogType } from "../modules/common/enums/log-type.enum";

export const dbConfig =() => createConnection({
    name:'default',
    type: "mysql",
    host: appsettings.db_connection.host,
    port: Number(appsettings.db_connection.port),
    username: appsettings.db_connection.username,
    password: appsettings.db_connection.password,
    database: appsettings.db_connection.database,
    synchronize:appsettings.db_connection.synchronize,
    entities: [
        User, Goal
    ],
    migrationsTableName: appsettings.db_connection.migrationsTableName,
    migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
    "cli": {
        "migrationsDir": "migration"
    },
    // synchronize: appsettings.db_connection.synchronize,
    logging: appsettings.db_connection.logging
}).then(connection => {
    ConsoleLog(`Connected to database on port ${appsettings.db_connection.port}`,LogType.Info)
}).catch(error => ConsoleLog(error,LogType.Exception));