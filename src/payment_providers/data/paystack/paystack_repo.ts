import {
    GeneratePaymentLinkError,
    PaymentProviderRepoInterface,
    VerifyTransactionResponseDto,
} from "@payment_providers/logic";
import { TransactionChannelType } from "@wallet/logic";
import generalConfig from "src/config";
import { HttpClient, HttpError, logError, encodeHex, decodeHex } from "src/utils";
import {
    InitializeTransactionResponseInterface,
    VerifyTransactionResponseInterface,
} from "./interfaces";

type PaystackChannelMapType = {
    [key: string]: Exclude<TransactionChannelType, "wallet">;
};
type PlatformToPaystackChannelMapType = {
    [key in Exclude<TransactionChannelType, "wallet">]: string;
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
    platformToPaystackChannelMap: PlatformToPaystackChannelMapType = {
        card: "card",
        bank: "bank_transfer",
    };
    transactionStatusMap: PaystackTransactionStatusMap = {
        success: "successful",
        failed: "failed",
    };
    errorMessage = generalConfig.payment.providerErrorMessage;
    conversionRate = 100;

    constructor() {
        this.client = new HttpClient({ baseUrl: this.baseUrl, headers: this.baseHeader });
    }

    convertAmountToPaystack = (amount: number) => {
        return amount * this.conversionRate;
    };

    convertAmountToPlatform = (amount: number) => {
        return amount / this.conversionRate;
    };

    makeCustomerEmail = (identifier: string) => {
        const email = encodeHex(identifier) + generalConfig.misc.emailSuffix;
        return email;
    };

    extractIdentifierFromEmail = (email: string) => {
        const hex = email.split("@")[0];
        return decodeHex(hex);
    };

    generatePaymentLink: PaymentProviderRepoInterface["generatePaymentLink"] = async (data) => {
        const body = {
            amount: this.convertAmountToPaystack(data.amount),
            email: this.makeCustomerEmail(data.walletId),
            currency: data.currency,
            reference: data.reference,
            channels: data.allowedChannels.map(
                (channel) => this.platformToPaystackChannelMap[channel]
            ),
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
                reference,
                walletId: this.extractIdentifierFromEmail(data.customer.email),
                amount: this.convertAmountToPlatform(data.amount),
                customerName: data.customer.first_name + " " + data.customer.last_name,
                customerFirstName: data.customer.first_name,
                customerLastName: data.customer.last_name,
                customerPhone: data.customer.phone
                    ? `${
                          data.customer.metadata?.calling_code
                              ? data.customer.metadata.calling_code
                              : ""
                      }${data.customer.phone}`
                    : null,
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