import { RedisService } from "@db/redis";
import redisLib, { RedisClientType } from "redis";
import { generateIdMock } from "src/__tests__/helpers/mocks";

const clientMock: {
    [key in keyof Pick<
        RedisClientType,
        "connect" | "disconnect" | "sendCommand" | "get" | "del"
    >]: jest.Mock;
} = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    sendCommand: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
};

const redis = new RedisService(clientMock as unknown as RedisClientType);

const obj = { foo: "bar" };
const objStr = JSON.stringify(obj);
const lockId = "something";
const seconds = 5;

describe("TESTING REDIS SERVICE", () => {
    describe(">>> lock", () => {
        const mockAllForLock = () => {
            generateIdMock.mockReturnValue(lockId);
            clientMock.sendCommand.mockResolvedValue(true);
        };

        it("should generate a lockId", async () => {
            mockAllForLock();
            await redis.lock(objStr, seconds);
            expect(generateIdMock).toHaveBeenCalledTimes(1);
        });

        it("should connect", async () => {
            mockAllForLock();
            await redis.lock(objStr, seconds);
            expect(clientMock.connect).toHaveBeenCalledTimes(1);
        });

        it("should set the lock with the correct key and value", async () => {
            mockAllForLock();
            await redis.lock(objStr, seconds);
            expect(clientMock.sendCommand).toHaveBeenCalledTimes(1);
            expect(clientMock.sendCommand).toHaveBeenCalledWith([
                "SET",
                objStr,
                lockId,
                "NX",
                "PX",
                `${seconds * 1000}`,
            ]);
        });

        describe("given setCommand returns true", () => {
            it("should return the lockId", async () => {
                mockAllForLock();
                const lock = await redis.lock(objStr, seconds);
                expect(lock).toBe(lockId);
            });
        });

        describe("given setCommand returns false", () => {
            it("should return null", async () => {
                mockAllForLock();
                clientMock.sendCommand.mockResolvedValue(false);
                const lock = await redis.lock(objStr, seconds);
                expect(lock).toBeNull();
            });
        });

        it("should disconnect", async () => {
            mockAllForLock();
            await redis.lock(objStr, seconds);
            expect(clientMock.disconnect).toHaveBeenCalledTimes(1);
        });
    });

    describe(">>> release", () => {
        const mockAllForRelease = () => {
            clientMock.sendCommand.mockResolvedValue(true);
            clientMock.get.mockResolvedValue(lockId);
        };
        it("should connect", async () => {
            mockAllForRelease();
            await redis.release(objStr, lockId);
            expect(clientMock.connect).toHaveBeenCalledTimes(1);
        });

        it("should call get", async () => {
            mockAllForRelease();
            await redis.release(objStr, lockId);
            expect(clientMock.get).toHaveBeenCalledTimes(1);
            expect(clientMock.get).toHaveBeenCalledWith(objStr);
        });

        describe("given the lock value (id) does not exist", () => {
            it("should return true", async () => {
                mockAllForRelease();
                clientMock.get.mockResolvedValue(null);
                const res = await redis.release(objStr, lockId);
                expect(res).toBe(true);
            });
        });

        describe("given the lock value (id) matches the client's lock value", () => {
            it("should call del and return true", async () => {
                mockAllForRelease();
                const res = await redis.release(objStr, lockId);
                expect(clientMock.del).toHaveBeenCalledTimes(1);
                expect(clientMock.del).toHaveBeenCalledWith(objStr);
                expect(res).toBe(true);
            });
        });

        describe("given the lock value (id) does not match the client's lock value", () => {
            it("should return false", async () => {
                mockAllForRelease();
                clientMock.get.mockResolvedValue("somethingelse");
                const res = await redis.release(objStr, lockId);
                expect(res).toBe(false);
            });
        });

        it("should disconnect", async () => {
            mockAllForRelease();
            await redis.release(objStr, lockId);
            expect(clientMock.disconnect).toHaveBeenCalledTimes(1);
        });
    });
});
