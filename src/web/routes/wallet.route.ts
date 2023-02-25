import { Router } from "express";
import { WalletRouteDependencies } from "./interfaces";
import { WalletController } from "../controllers/wallet.controller";
import { validateBody } from "../middleware/validation";
import { CreateBusinessWalletValidator } from "../validators";

export class WalletRoute {
    constructor(private readonly _deps: WalletRouteDependencies) {}

    init = () => {
        const router = Router();
        const controller = new WalletController(this._deps.walletService);
        const restrictTo = this._deps.authMiddleware.restrictTo;

        router.post(
            "/create",
            restrictTo(["business", "apiKey"]),
            validateBody(CreateBusinessWalletValidator),
            controller.createBusinessWallet
        );

        return router;
    };
}
