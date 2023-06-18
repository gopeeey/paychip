import {
    GeneratePaymentLinkError,
    PaymentProviderRepoInterface,
    VerifyTransactionResponseDto,
} from "@logic/payment_providers";
import { TransactionChannelType } from "@logic/transaction";
import generalConfig from "src/config";
import { HttpClient, HttpError, logError } from "src/utils";
import {
    InitializeTransactionResponseInterface,
    VerifyTransactionResponseInterface,
} from "./interfaces";

type PaystackChannelMapType = {
    [key: string]: Exclude<TransactionChannelType, "wallet">;
};
type PaystackTransactionStatusMap = {
    [key: string]: "successful" | "failed";
};

export class PaystackRepo implements PaymentProviderRepoInterface {
    config = generalConfig.thirdParty.paystack;
    secretKey = this.config.secretKey;
    publicKey = this.config.publicKey;
    baseHeader = { Authorization: `Bearer ${this.secretKey}` };
    baseUrl = "https://api.paystack.co";
    client: HttpClient;
    channelMap: PaystackChannelMapType = { card: "card", bank_transfer: "bank" };
    transactionStatusMap: PaystackTransactionStatusMap = {
        success: "successful",
        failed: "failed",
    };
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

    verifyTransaction: PaymentProviderRepoInterface["verifyTransaction"] = async (reference) => {
        try {
            const response = await this.client.get<VerifyTransactionResponseInterface>(
                `/transaction/verify/${reference}`
            );
            const data = response.data;
            if (!["success", "failed"].includes(data.status)) return null;

            const dto = new VerifyTransactionResponseDto({
                accountName: data.authorization?.account_name || data.authorization?.sender_name,
                accountNumber: data.authorization?.sender_bank_account_number || null,
                bankName: data.authorization?.bank,
                cardNumber:
                    data.authorization?.channel === "card"
                        ? `${data.authorization.bin}xxx${data.authorization.last4}`
                        : null,
                cardType: data.authorization?.channel === "card" ? data.authorization.brand : null,
                channel: data.authorization?.channel
                    ? this.channelMap[data.authorization.channel]
                    : null,
                provider: "paystack",
                providerRef: data.id.toString(),
                status: this.transactionStatusMap[data.status],
            });

            return dto;
        } catch (err) {
            let message = "Error verifying transaction from paystack";
            if (err instanceof HttpError) message += ": " + err.message;
            logError({ error: err, message, channels: ["console", "external"] });
            return null;
        }
    };
}
