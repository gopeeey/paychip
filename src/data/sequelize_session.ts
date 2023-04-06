import { StartSessionType } from "@logic/session_interface";
import { db } from "@data/db_old";

export const StartSequelizeSession: StartSessionType = async () => {
    const session = await db.transaction();
    return session;
};
