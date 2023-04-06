import config from "config";
import { ServerConfigType, DbConfigType, MiscConfigType } from "./config/default";
config.util.loadFileConfigs("./config");

const serverConfig = config.get<ServerConfigType>("server");
const dbConfig = config.get<DbConfigType>("db");
const misc = config.get<MiscConfigType>("misc");

const appConfig = {
    server: serverConfig,
    db: dbConfig,
    misc,
};
export default appConfig;
