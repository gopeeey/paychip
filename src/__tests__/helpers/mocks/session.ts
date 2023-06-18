import { SessionInterface } from "@bases/logic";

export const sessionMock: SessionInterface = {
    commit: jest.fn(async () => {}),
    rollback: jest.fn(async () => {}),
    ended: false,
};
