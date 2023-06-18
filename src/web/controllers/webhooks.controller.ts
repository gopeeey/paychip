import { PaymentProviderServiceInterface } from "@logic/payment_providers";
import { BaseController } from "./base.controller";

export type WebhooksControllerDependencies = {
    paymentProviderService: PaymentProviderServiceInterface;
};

export class WebhooksController extends BaseController {
    constructor(private readonly _deps: WebhooksControllerDependencies) {
        super();
    }
}
