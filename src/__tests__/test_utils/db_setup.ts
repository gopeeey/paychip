import { db } from "@data/db";

export const syncDbForce = async () => {
    await db.sync({ force: true, logging: false });
};

export const closeDbConnection = async () => {
    await db.close();
};
