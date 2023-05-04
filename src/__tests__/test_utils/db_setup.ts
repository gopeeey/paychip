import config from "src/config";
import runnerFunc from "node-pg-migrate";
import path from "path";
import { Pool } from "pg";

const postgresTestConfig = config.db.postgresTest;

export const runMigrations = async (direction: "up" | "down", pool: Pool, count = 10000) => {
    console.log("Running migrations", direction);

    const client = await pool.connect();
    await runnerFunc({
        dbClient: client,
        direction,
        count,
        dir: path.join(__dirname, "../../../migrations"),
        migrationsTable: "pgmigrations",
    });
    client.release();
};

export const DBSetup = (seeder: (pool: Pool) => Promise<void>) => {
    const pool = new Pool({
        database: postgresTestConfig.name,
        user: postgresTestConfig.username,
        password: postgresTestConfig.password,
        host: postgresTestConfig.host,
    });

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
            await runMigrations("up", pool);
            await seeder(pool);
        })();
    });

    afterEach(() => runMigrations("down", pool));

    afterAll(() => pool.end());

    return pool;
};

export class SeedingError extends Error {
    constructor(message?: string) {
        const m = `Seeding error: ${message}`;
        super(m);
        console.log("\n\n\n", m);
    }
}
