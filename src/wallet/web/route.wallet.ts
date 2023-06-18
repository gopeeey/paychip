import { Router } from "express";
import { WalletController } from "./controller.wallet";
import { AuthMiddlewareInterface, validateBody } from "@bases/web";
import * as validators from "./validators";
import { WalletServiceInterface } from "@wallet/logic";

export interface WalletRouteDependencies {
    walletService: WalletServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
}

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
