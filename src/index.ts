import App from "./app";
import startServer from "./server";
import { container } from "./container";
import config from "./config";
import { db } from "@data/db_old";

const run = async () => {
    try {
        if (config.server.nodeEnv !== "production") await db.sync();
        startServer(new App(container).init());
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

run();
