import App from "./app";
import startServer from "./server";
import { container } from "./container";
// import db from "./db";

const run = async () => {
    try {
        // await db.sync();
        startServer(new App(container).init());
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

run();
