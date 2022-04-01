import dotenv from 'dotenv';
dotenv.config();

export const appsettings ={
    PORT: process.env.APP_PORT,
    node_env: process.env.NODE_ENV,
    db_connection:{
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username:process.env.DB_USERNAME,
        password:process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        migrationsTableName: process.env.DB_MIGRATION_TABLE,
        synchronize: true,
        logging:false
    },
    cache_config:{
        url: 'redis://localhost:6379',
        prefix:'devApp'
    },
    GoalsConfig:{
        minGoalsLength: 3
    },
    encryption:{
        length: 10,
        secreteKey: process.env.SECRETE_KEY
    }
}