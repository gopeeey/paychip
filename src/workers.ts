import { ImdsInterface } from "@bases/logic";
import { TransactionServiceInterface } from "@wallet/logic";
import { DebugLogger, debuglog as nodeDebugLog } from "util";
import config from "./config";

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
    declare debugLog: DebugLogger;

    constructor(props: BackgroundWorkerType) {
        this.id = props.id;
        this.lock = props.lock;
        this.interval = props.interval; // in seconds
        this.workerFunction = props.workerFunction;
        this.active = props.active;
        this.imdsService = props.imdsService;
        this.lockPeriod = props.lockPeriod;
        this.debugLog = nodeDebugLog(`worker_${props.id}`);
    }

    async start() {
        if (!this.active) return;
        this.debugLog("Starting...");
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
            if (this.lock) {
                this.debugLog("Acquiring lock");
                lock = await this.imdsService.lock(this.id, this.lockPeriod as number);
                if (!lock) return this.debugLog("Lock acquisition failed");
            }

            this.debugLog("Running function");

            this.workerFunction(async () => {
                this.debugLog("Function complete");
                if (this.lock && lock) {
                    this.debugLog("Releasing lock");
                    await this.imdsService.release(this.id, lock as string);
                }
            });
        } catch (err) {
            if (lock && this.lock) await this.imdsService.release(this.id, lock);

            //@TODO Log this error to your monitoring tool
            this.debugLog("An error occurred", err);
        }
    }

    private loop() {
        this.timeout = setInterval(this.run.bind(this), this.interval * 1000);
    }
}

interface WorkerFunctionsInterface {
    enqueueTransfersForVerification: TransactionServiceInterface["enqueueTransfersForVerification"];
    retryFailedTransfers: TransactionServiceInterface["retryTransfers"];
}

export const startWorkers = (
    imdsService: ImdsInterface,
    workerFunctions: WorkerFunctionsInterface
) => {
    const workers: BackgroundWorker[] = [
        new BackgroundWorker({
            id: "EnqueueTransfersForVerification",
            active: true,
            imdsService,
            interval: 60,
            lock: true,
            lockPeriod: 120,
            workerFunction: workerFunctions.enqueueTransfersForVerification,
        }),

        new BackgroundWorker({
            id: "RetryFailedTransfers",
            active: true,
            imdsService,
            interval: config.payment.retrialInterval * 60,
            lock: true,
            lockPeriod: config.payment.retrialInterval * 2 * 60,
            workerFunction: workerFunctions.retryFailedTransfers,
        }),
    ];

    for (const worker of workers) {
        worker.start();
    }
};
