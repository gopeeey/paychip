import { Request, Response, Router } from "express";
import { AuthMiddlewareInterface } from "../../contracts/interfaces";

export default class EmptyRoute {
    constructor(private readonly _authMiddleware: AuthMiddlewareInterface) {}

    init = () => {
        const router = Router();
        const controller = async (req: Request, res: Response) => res.send("true");
        const { restrictTo } = this._authMiddleware;
        router.get("/account", restrictTo(["account"]), controller);
        router.get("/business", restrictTo(["business"]), controller);
        router.get("/apikey", restrictTo(["apiKey"]), controller);
        router.get("/account-and-business", restrictTo(["account", "business"]), controller);
        router.get("/business-and-apikey", restrictTo(["business", "apiKey"]), controller);
        router.get("/account-and-apikey", restrictTo(["account", "apiKey"]), controller);
        router.get("/unprotected", controller);

        return router;
    };
}
