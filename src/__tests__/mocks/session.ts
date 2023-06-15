import { SessionInterface } from "@logic/session_interface";

export const sessionMock: SessionInterface = {
    commit: jest.fn(async () => {}),
    rollback: jest.fn(async () => {}),
    ended: false,
};
