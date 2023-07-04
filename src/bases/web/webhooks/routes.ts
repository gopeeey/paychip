import { Router } from "express";
import { WebhooksController } from "./controller";
import { TransactionQueueInterface } from "@queues/transactions";

export interface WebhookRouteDependencies {
    publishTransactionTask: TransactionQueueInterface["publish"];
}

export class WebhookRoute {
    constructor(private readonly _deps: WebhookRouteDependencies) {}
    init = () => {
        const router = Router();
        const controller = new WebhooksController({
            publishTransactionTask: this._deps.publishTransactionTask,
        });

        router.post("/paystack", controller.paystack);

        return router;
    };
}
