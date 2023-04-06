import { StartSequelizeSession } from "@data/sequelize_session";

export const startSession = async () => {
    const session = await StartSequelizeSession();
    return session;
};
