import { Router } from "express";
import { WalletRouteDependencies } from "./interfaces";
import { WalletController } from "../controllers/wallet.controller";
import { validateBody } from "../middleware/validation";
import * as validators from "../validators/wallet";

export class WalletRoute {
    constructor(private readonly _deps: WalletRouteDependencies) {}

    init = () => {
        const router = Router();
        const controller = new WalletController(this._deps.walletService);
        const restrictTo = this._deps.authMiddleware.restrictTo;

        router.post(
            "",
            restrictTo(["business", "apiKey"]),
            validateBody(validators.CreateWalletValidator),
            controller.createWallet
        );

        router.post(
            "/fund/link",
            restrictTo(["apiKey", "business"]),
            validateBody(validators.GetFundingLinkValidator),
            controller.getFundingLink
        );

        return router;
    };
}
