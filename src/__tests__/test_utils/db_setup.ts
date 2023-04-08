import { db } from "@data/db_old";
import config from "src/config";
import runnerFunc from "node-pg-migrate";
import { pool } from "@data/db";
import path from "path";

const postgresTestConfig = config.db.postgresTest;

export const runMigrations = async (direction: "up" | "down") => {
    console.log("Running migrations", direction);

    // const client = await pool.connect();
    await runnerFunc({
        databaseUrl: {
            database: postgresTestConfig.name,
            user: postgresTestConfig.username,
            password: postgresTestConfig.password,
            host: postgresTestConfig.host,
        },
        direction,
        dir: path.join(__dirname, "../../../migrations"),
        migrationsTable: "pgmigrations",
    });
    // client.release();
};

export const closeDbConnection = async () => {
    await db.close();
};

export const DBSetup = (seeder: () => Promise<void>) => {
    // seed data
    // beforeAll((done: jest.DoneCallback) => {
    //     (async () => {
    //         pool = new Pool({
    //             database: pgTestConfig.name,
    //             user: pgTestConfig.username,
    //             password: pgTestConfig.password,
    //             host: pgTestConfig.host,
    //         });
    //         done();
    //     })();
    // });

    beforeEach(() => {
        return (async () => {
            await runMigrations("up");
            await seeder();
        })();
    });

    afterEach(() => {
        return runMigrations("down");
    });

    afterAll(() => {
        return pool.end();
    });
};

export class SeedingError extends Error {
    constructor(message?: string) {
        const m = `Seeding error: ${message}`;
        super(m);
        console.log("\n\n\n", m);
    }
}
