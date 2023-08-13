import { Router } from "express";
import { WebhooksController } from "./controller";
import { TransactionQueueInterface } from "@queues/transactions";
import { VerifyTransferQueueInterface } from "@queues/transfers";

export interface WebhookRouteDependencies {
    publishTransactionTask: TransactionQueueInterface["publish"];
    publishTransferVerificationTask: VerifyTransferQueueInterface["publish"];
}

export class WebhookRoute {
    constructor(private readonly _deps: WebhookRouteDependencies) {}
    init = () => {
        const router = Router();
        const controller = new WebhooksController({
            publishTransactionTask: this._deps.publishTransactionTask,
            publishTransferVerificationTask: this._deps.publishTransferVerificationTask,
        });

        router.post("/paystack", controller.paystack);

        return router;
    };
}
