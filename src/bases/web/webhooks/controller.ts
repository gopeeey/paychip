import { BaseController, StandardControllerType } from "@bases/web";
import { createHmac } from "crypto";
import config from "src/config";
import { sendResponse } from "src/utils";
import {
    VerifyTransactionResponseInterface,
    VerifyTransferReponseInterface,
} from "@payment_providers/data";
import { TransactionMessageDto, TransactionQueueInterface } from "@queues/transactions";
import { TransferQueueInterface, VerifyTransferQueueInterface } from "@queues/transfers";
import { VerifyTransferDto } from "@payment_providers/logic";

type PaystackBodyType = {
    event: "charge.success" | "transfer.success" | "transfer.failed" | "transfer.reversed";
    data:
        | VerifyTransactionResponseInterface["data"]
        | VerifyTransferReponseInterface["data"]
        | { boo: "foo" };
};

export type WebhooksControllerDependencies = {
    publishTransactionTask: TransactionQueueInterface["publish"];
    publishTransferVerificationTask: VerifyTransferQueueInterface["publish"];
};

export class WebhooksController extends BaseController {
    constructor(private readonly _deps: WebhooksControllerDependencies) {
        super();
    }

    paystack: StandardControllerType = async (req, res, next) => {
        const provider = "paystack";
        await this.handleReq(next, async () => {
            const hash = createHmac("sha512", config.thirdParty.paystack.secretKey)
                .update(JSON.stringify(req.body))
                .digest("hex");
            if (hash == req.headers["x-paystack-signature"]) {
                const body = req.body as PaystackBodyType;

                switch (body.event) {
                    case "charge.success":
                        const chargeData = body.data as VerifyTransactionResponseInterface["data"];

                        await this._deps.publishTransactionTask(
                            new TransactionMessageDto({ provider, reference: chargeData.reference })
                        );
                        break;

                    case "transfer.success":
                        const transferData = body.data as VerifyTransferReponseInterface["data"];
                        await this._deps.publishTransferVerificationTask(
                            new VerifyTransferDto({
                                provider,
                                reference: transferData.reference,
                            })
                        );
                        break;

                    case "transfer.failed":
                        console.log("NOT HANDLING FAILED TRANSFER WEBHOOK CALL YET");
                        break;

                    case "transfer.reversed":
                        console.log("NOT HANDLING REVERSED TRANSFER WEBHOOK CALL YET");
                        break;

                    default:
                        break;
                }
            }

            sendResponse(res, { code: 200, data: { hash } });
            // @TODO: Remove the hash from the response
        });
    };
}
