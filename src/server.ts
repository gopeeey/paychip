import http from "http";
import { Application } from "express";
import config from "./config";
import { startWorkers } from "./workers";
import { DependencyContainerInterface } from "./container";

const startServer = (app: Application, container: DependencyContainerInterface) => {
    const server = http.createServer(app);
    startWorkers(container.imdsService, {
        enqueueTransfersForVerification:
            container.transactionService.enqueueTransfersForVerification,
        retryFailedTransfers: container.transactionService.retryTransfers,
    });

    server.listen(config.server.port, () => {
        console.info("\x1b[32m%s\x1b[0m", `Server is running on port ${config.server.port}`);
    });
};

export default startServer;
