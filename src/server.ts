import http from "http";
import { Application } from "express";
import config from "./config";
import { ImdsInterface } from "@bases/logic";

const startServer = (app: Application, imdsService: ImdsInterface) => {
    const server = http.createServer(app);
    // Do whatever you want with the server, sockets...and all that

    server.listen(config.server.port, () => {
        console.info(`Server is running on port ${config.server.port}`);
    });
};

export default startServer;
