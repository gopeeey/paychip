import { ImdsInterface } from "@bases/logic";
import { BackgroundWorker } from "src/workers";

const imdsServiceMock: { [key in keyof Pick<ImdsInterface, "lock" | "release">]: jest.Mock } = {
    lock: jest.fn(async (lock: string) => lock + "LockId"),
    release: jest.fn(async () => true),
};

const workerFunction = jest.fn((callback: () => void) => {
    callback();
});

const worker = new BackgroundWorker({
    id: "WorkerId",
    active: true,
    interval: 5,
    lock: true,
    lockPeriod: 10,
    workerFunction,
    imdsService: imdsServiceMock,
});

const inactiveWorker = new BackgroundWorker({
    id: "InactiveWorkerId",
    active: false,
    interval: 5,
    lock: true,
    lockPeriod: 10,
    workerFunction,
    imdsService: imdsServiceMock,
});

const unlockedWorker = new BackgroundWorker({
    id: "UnlockedWorkerId",
    active: true,
    interval: 10,
    lock: false,
    workerFunction,
    imdsService: imdsServiceMock,
});

describe("TESTING BACKGROUND WORKER IMPLEMENTATION", () => {
    describe("given the worker is inactive", () => {
        it("should not run", async () => {
            await inactiveWorker.start();
            expect(workerFunction).not.toHaveBeenCalled();
            expect(imdsServiceMock.lock).not.toHaveBeenCalled();
            expect(imdsServiceMock.release).not.toHaveBeenCalled();
        });
    });
    describe("given the property lock is true", () => {
        it("should try to acquire a lock with the worker's id", async () => {
            await worker.start();
            expect(imdsServiceMock.lock).toHaveBeenCalledTimes(1);
            expect(imdsServiceMock.lock).toHaveBeenCalledWith(worker.id, worker.lockPeriod);
            worker.stop();
        });

        describe("given the lock acquisition succeeds", () => {
            it("should call the workerFunction with a callback to release the lock", async () => {
                jest.useFakeTimers();
                await worker.start();
                const runCount = 4; // Number of times it should run
                const timeGone = worker.interval * (4 - 0.8) * 1000;
                jest.advanceTimersByTime(timeGone);
                setTimeout(() => {
                    expect(workerFunction).toHaveBeenCalledTimes(runCount);
                    expect(workerFunction).toHaveBeenCalledWith(expect.any(Function));

                    expect(imdsServiceMock.lock).toHaveBeenCalledTimes(runCount);
                    expect(imdsServiceMock.lock).toHaveBeenCalledWith(worker.id, worker.lockPeriod);
                    expect(imdsServiceMock.release).toHaveBeenCalledTimes(runCount);

                    jest.clearAllTimers();
                    worker.stop();
                }, 500);
            });

            describe("given the workerFunction throws an error", () => {
                it("should release the lock", async () => {
                    workerFunction.mockImplementationOnce(() => {
                        throw new Error();
                    });
                    await worker.start();
                    expect(imdsServiceMock.release).toHaveBeenCalledTimes(1);
                    worker.stop();
                });
            });
        });

        describe("given the lock acquisition fails", () => {
            it("should not call the workerFunction", async () => {
                imdsServiceMock.lock.mockResolvedValueOnce(null);
                await worker.start();
                expect(workerFunction).not.toHaveBeenCalled();
                expect(imdsServiceMock.release).not.toHaveBeenCalled();
            });
        });
    });

    describe("given the property lock is false", () => {
        it("should call the workerFunction without acquiring a lock", async () => {
            jest.useFakeTimers();
            await unlockedWorker.start();
            const runCount = 4;
            const timeGone = unlockedWorker.interval * (runCount - 0.8) * 1000;
            jest.advanceTimersByTime(timeGone);

            setTimeout(() => {
                expect(workerFunction).toHaveBeenCalledTimes(4);
                expect(workerFunction).toHaveBeenCalledWith(expect.any(Function));

                expect(imdsServiceMock.lock).not.toHaveBeenCalled();
                expect(imdsServiceMock.release).not.toHaveBeenCalled();
                unlockedWorker.stop();
            }, 500);
        });

        describe("given the workerFunction throws an error", () => {
            it("should not call the release lock function", async () => {
                workerFunction.mockImplementationOnce(() => {
                    throw new Error();
                });
                await unlockedWorker.start();
                expect(imdsServiceMock.release).not.toHaveBeenCalled();
                unlockedWorker.stop();
            });
        });
    });
});
