import { DependencyContainerInterface } from "./container";
import express from "express";
import morgan from "morgan";
import { errorHandler, RootRoutes } from "@bases/web";

export default class App {
    constructor(private readonly _container: DependencyContainerInterface) {}

    init() {
        const app = express();

        app.use(morgan("dev"));
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

        // API Rules
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            );

            if (req.method === "OPTIONS") {
                res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
                return res.json({});
            }
            next();
        });

        // Health check
        app.get("/ping", (req, res) => res.json({ message: "pong" }));

        // Routes
        app.use("", new RootRoutes(this._container).init());

        // Error handler
        app.use(errorHandler);

        // Not found
        app.use((req, res, next) => {
            res.status(404).json({
                message: "not found",
            });
        });

        return app;
    }
}
