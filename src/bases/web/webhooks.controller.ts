import { PaymentProviderServiceInterface } from "@third_party/payment_providers/logic";
import { BaseController } from "@bases/web";

export type WebhooksControllerDependencies = {
    paymentProviderService: PaymentProviderServiceInterface;
};

export class WebhooksController extends BaseController {
    constructor(private readonly _deps: WebhooksControllerDependencies) {
        super();
    }
}
