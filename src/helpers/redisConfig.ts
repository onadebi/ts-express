import { createClient } from 'redis';
import { appsettings } from '../config/appsettings';
import { LogType } from '../modules/common/enums/log-type.enum';
import { ConsoleLog } from '../utils/util-helper';

export const client = createClient({url:appsettings.cache_config.url});

export const SetToCache = async <T>(key: string, value: T, ttl: number = 300) => {
    let objResp;
    client.on('error', (err) => ConsoleLog(`Redis Client Error ${err}`,LogType.Exception));
    try {
        objResp = await client.set(`${appsettings.cache_config.prefix}:${key}`,JSON.stringify(value),{EX: ttl});
    } catch (error) {
        ConsoleLog(`Redis Server Error ${error}`,LogType.Exception)
    }
};

export const GetFromCache = async(key: string) : Promise<string|null> => {
    let objResp: string | null = '';
    client.on('error', (err) => ConsoleLog(`Redis Client Error ${err}`,LogType.Exception));
    try {
        objResp = await client.get(`${appsettings.cache_config.prefix}:${key}`);        
    } catch (error) {
        ConsoleLog(`Redis Server Error ${error}`,LogType.Exception)
    }
    return objResp;
};