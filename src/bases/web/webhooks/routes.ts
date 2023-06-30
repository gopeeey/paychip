import { Router } from "express";
import { WebhooksController } from "./controller";
import { PaymentProviderServiceInterface } from "@third_party/payment_providers/logic";
import { WalletServiceInterface } from "@wallet/logic";

export interface WebhookRouteDependencies {
    paymentProviderService: PaymentProviderServiceInterface;
    walletService: WalletServiceInterface;
}

export class WebhookRoute {
    constructor(private readonly _deps: WebhookRouteDependencies) {}
    init = () => {
        const router = Router();
        const controller = new WebhooksController({
            paymentProviderService: this._deps.paymentProviderService,
            walletService: this._deps.walletService,
        });

        router.post("/paystack", controller.paystack);

        return router;
    };
}
