import { PaymentProviderRepoInterface } from "@logic/payment_providers";
import generalConfig from "src/config";

export class PaystackRepo implements PaymentProviderRepoInterface {
    config = generalConfig.thirdParty.paystack;
    secretKey = this.config.secretKey;
    publicKey = this.config.publicKey;
    baseHeader = { Authorization: `Bearer ${this.secretKey}` };

    generatePaymentLink: PaymentProviderRepoInterface["generatePaymentLink"] = async (data) => {
        return "coming soon";
    };
}
