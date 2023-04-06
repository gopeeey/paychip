import App from "./app";
import startServer from "./server";
import { container } from "./container";
import appConfig from "./app_config";
import { db } from "@data/db_old";
import { runAssociations } from "@data/associations";

const run = async () => {
    try {
        runAssociations();
        if (appConfig.server.nodeEnv !== "production") await db.sync();
        startServer(new App(container).init());
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

run();
