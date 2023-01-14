import { DependencyContainerInterface } from "./d_container";
import express from "express";
import morgan from "morgan";
import Routes from "./web/routes";

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
        app.use("", new Routes(this._container).init());

        // Not found
        app.use((req, res, next) => {
            res.status(404).json({
                message: "not found",
            });
        });

        return app;
    }
}
