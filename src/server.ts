import http from "http";
import { Application } from "express";
import config from "./config";
import { startWorkers } from "./workers";
import { ImdsInterface } from "@bases/logic";

const startServer = (app: Application, imdsService: ImdsInterface) => {
    const server = http.createServer(app);
    startWorkers(imdsService);

    server.listen(config.server.port, () => {
        console.info(`Server is running on port ${config.server.port}`);
    });
};

export default startServer;
