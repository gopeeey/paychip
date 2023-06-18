import config from "src/config";
import { Pool } from "pg";
import { runMigrations } from "@db/postgres";

const postgresTestConfig = config.db.postgresTest;

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
            await runMigrations("up", pool, 1);
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
