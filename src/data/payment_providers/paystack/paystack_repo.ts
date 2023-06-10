import { GeneratePaymentLinkError, PaymentProviderRepoInterface } from "@logic/payment_providers";
import { TransactionChannelType } from "@logic/transaction";
import generalConfig from "src/config";
import { HttpClient, HttpError } from "src/utils";
import { InitializeTransactionResponseInterface } from "./interfaces";

type PaystackChannelMapType = { [key in Exclude<TransactionChannelType, "wallet">]: string };

export class PaystackRepo implements PaymentProviderRepoInterface {
    config = generalConfig.thirdParty.paystack;
    secretKey = this.config.secretKey;
    publicKey = this.config.publicKey;
    baseHeader = { Authorization: `Bearer ${this.secretKey}` };
    baseUrl = "https://api.paystack.co";
    client: HttpClient;
    channelMap: PaystackChannelMapType = { card: "card", bank: "bank_transfer" };
    errorMessage = generalConfig.payment.providerErrorMessage;

    constructor() {
        this.client = new HttpClient({ baseUrl: this.baseUrl, headers: this.baseHeader });
    }

    generatePaymentLink: PaymentProviderRepoInterface["generatePaymentLink"] = async (data) => {
        const body = {
            amount: data.amount,
            email: data.walletId + generalConfig.misc.emailSuffix,
            currency: data.currency,
            reference: data.transactionId,
            channels: data.allowedChannels.map((channel) => this.channelMap[channel]),
        };

        try {
            const response = await this.client.post<InitializeTransactionResponseInterface>({
                url: "/transaction/initialize",
                body,
            });
            return response.data.authorization_url;
        } catch (err) {
            if (err instanceof HttpError) {
                const logData = {
                    requestBody: body,
                    errorResponseData: err.data,
                    errorMessage: err.message,
                };
                throw new GeneratePaymentLinkError({
                    message: this.errorMessage,
                    logData,
                });
            }

            throw err;
        }
    };
}
