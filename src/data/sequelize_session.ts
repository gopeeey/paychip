import { StartSessionType } from "@logic/session_interface";
import { db } from "./db";

export const StartSequelizeSession: StartSessionType = async () => {
    const session = await db.transaction();
    return session;
};
