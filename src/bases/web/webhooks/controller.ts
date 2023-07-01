import { PaymentProviderServiceInterface } from "@third_party/payment_providers/logic";
import { BaseController, StandardControllerType } from "@bases/web";
import { createHmac } from "crypto";
import config from "src/config";
import { sendResponse } from "src/utils";
import { WalletServiceInterface } from "@wallet/logic";
import { VerifyTransactionResponseInterface } from "@third_party/payment_providers/data";

type PaystackBodyType = {
    event: "charge.success" | "transfer.success" | "transfer.failed" | "transfer.reversed";
    data: VerifyTransactionResponseInterface["data"] | { boo: "foo" };
};

export type WebhooksControllerDependencies = {
    paymentProviderService: PaymentProviderServiceInterface;
    walletService: WalletServiceInterface;
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
                        await this._deps.walletService.resolveTransaction({
                            provider,
                            reference: chargeData.reference,
                        });
                        break;
                    case "transfer.failed":
                        break;
                    case "transfer.reversed":
                        break;
                    case "transfer.success":
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
