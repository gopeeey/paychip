import express from "express";
import morgan from "morgan";
// import routes from "./api/routes";

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

// Routes
// app.use("", routes);

// Health check
app.get("/ping", (req, res) => res.json({ message: "pong" }));

// Not found
app.use((req, res, next) => {
    res.status(404).json({
        message: "not found",
    });
});

export default app;
