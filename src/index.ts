import app from "./app";
import startServer from "./server";
// import db from "./db";

const run = async () => {
    try {
        // await db.sync();
        startServer(app);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

run();
