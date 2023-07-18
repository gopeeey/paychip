import { ImdsInterface } from "@bases/logic";

export const imdsServiceMock: { [key in keyof ImdsInterface]: jest.Mock } = {
    lock: jest.fn(),
    release: jest.fn(),
};
