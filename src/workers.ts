import { ImdsInterface } from "@bases/logic";

type CallbackType = () => void;
type WorkerFunctionType = (callback: CallbackType) => void;

interface BaseWorker {
    id: string;
    interval: number;
    workerFunction: WorkerFunctionType;
    active: boolean;
    imdsService: Pick<ImdsInterface, "lock" | "release">;
}

interface LockedWorker extends BaseWorker {
    lock: true;
    lockPeriod: number; // in seconds
}

interface UnlockedWorker extends BaseWorker {
    lock: false;
    lockPeriod?: null;
}

type BackgroundWorkerType = LockedWorker | UnlockedWorker;

export class BackgroundWorker {
    id: string;
    lock: boolean;
    lockPeriod?: BackgroundWorkerType["lockPeriod"];
    interval: number;
    workerFunction: WorkerFunctionType;
    active: boolean;
    imdsService: ImdsInterface;
    declare timeout: NodeJS.Timer;

    constructor(props: BackgroundWorkerType) {
        this.id = props.id;
        this.lock = props.lock;
        this.interval = props.interval;
        this.workerFunction = props.workerFunction;
        this.active = props.active;
        this.imdsService = props.imdsService;
        this.lockPeriod = props.lockPeriod;
    }

    async start() {
        if (!this.active) return;
        await this.run();
        this.loop();
    }

    stop() {
        clearInterval(this.timeout);
    }

    private async run() {
        let lock: string | null = null;

        try {
            // Acquire lock if needed
            if (this.lock) lock = await this.imdsService.lock(this.id, this.lockPeriod as number);
            if (!lock) return;

            this.workerFunction(
                async () => await this.imdsService.release(this.id, lock as string)
            );
        } catch (err) {
            if (lock && this.lock) await this.imdsService.release(this.id, lock);

            //@TODO Log this error to your monitoring tool
            console.log(err);
        }
    }

    private loop() {
        this.timeout = setInterval(this.run.bind(this), this.interval * 1000);
    }
}

export const startWorkers = (imdsService: ImdsInterface) => {
    const workers: BackgroundWorker[] = [
        new BackgroundWorker({
            id: "TestWorker",
            active: true,
            imdsService,
            interval: 4,
            lock: true,
            lockPeriod: 5,
            workerFunction: (callback: () => void) => {
                console.log("I am getting called");
                callback();
            },
        }),
    ];

    for (const worker of workers) {
        worker.start();
    }
};
