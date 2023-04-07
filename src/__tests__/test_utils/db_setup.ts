import { runAssociations } from "@data/associations";
import { db } from "@data/db_old";

export const syncDbForce = async () => {
    // runAssociations();
    await db.sync({ force: true, logging: false });
};

export const closeDbConnection = async () => {
    await db.close();
};

export const dropAll = async () => {
    await db.drop();
};

export const DBSetup = async (seeder: () => Promise<void>) => {
    // beforeAll((done: jest.DoneCallback) => {
    //     (async () => {
    //         // runAssociations();
    //         done();
    //     })();
    // });

    // seed data
    beforeEach((done: jest.DoneCallback) => {
        (async () => {
            await syncDbForce();
            await seeder();
            done();
        })();
    });

    afterAll((done: jest.DoneCallback) => {
        (async () => {
            await closeDbConnection();
            done();
        })();
    });
};

export class SeedingError extends Error {
    constructor(message?: string) {
        const m = `Seeding error: ${message}`;
        super(m);
        console.log("\n\n\n", m);
    }
}
