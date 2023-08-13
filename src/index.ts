import { connectToDb } from "@db/postgres";
import App from "./app";
import { buildContainer } from "./container";
import startServer from "./server";

const run = async () => {
    try {
        const pool = await connectToDb();
        const container = await buildContainer(pool);
        const app = new App(container).init();
        startServer(app, container.imdsService);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

run();
