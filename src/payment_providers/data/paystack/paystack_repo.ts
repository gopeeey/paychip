import {
    BankDetails,
    GeneratePaymentLinkError,
    InvalidBankDetails,
    PaymentProviderRepoInterface,
    SendMoneyError,
    VerifyTransactionResponseDto,
} from "@payment_providers/logic";
import { TransactionChannelType } from "@wallet/logic";
import generalConfig from "src/config";
import { HttpClient, HttpError, logError, encodeHex, decodeHex } from "src/utils";
import {
    CreateTransferRecipientResponseInterface,
    InitializeTransactionResponseInterface,
    SendMoneyResponseInterface,
    TransferRecipient,
    VerifyBankDetailsResponseInterface,
    VerifyTransactionResponseInterface,
} from "./interfaces";
import { InternalError } from "@bases/logic";
import { runQuery } from "@db/postgres";
import * as queries from "./queries";
import { Pool } from "pg";

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
    pool: Pool;
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
    currencyBankAccountTypeMap: { [key: string]: string } = {
        NGN: "nuban",
    };

    constructor(pool: Pool) {
        this.client = new HttpClient({ baseUrl: this.baseUrl, headers: this.baseHeader });
        this.pool = pool;
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

    verifyBankDetails: PaymentProviderRepoInterface["verifyBankDetails"] = async (details) => {
        try {
            const response = await this.client.get<VerifyBankDetailsResponseInterface>(
                `/bank/resolve?account_number=${details.accountNumber}&bank_code=${details.bankCode}`
            );

            const data = response.data;
            const verifiedDetails = new BankDetails({
                accountName: data.account_name,
                accountNumber: data.account_number,
                bankCode: details.bankCode,
            });

            return verifiedDetails;
        } catch (err) {
            if (err instanceof HttpError) {
                if (err.statusCode === 422) {
                    throw new InvalidBankDetails();
                }
            }

            throw new InternalError("Error verifying bank details from provider", {
                ...details,
                provider: "paystack",
            });
        }
    };

    getOrCreateTransferRecipient = async (bankDetails: BankDetails, currencyCode: string) => {
        const res = await runQuery<TransferRecipient>(
            queries.getTransferRecipient(bankDetails),
            this.pool
        );
        const existing = res.rows[0];
        if (existing) return existing;

        const body = {
            type: this.currencyBankAccountTypeMap[currencyCode],
            name: bankDetails.accountName,
            account_number: bankDetails.accountNumber,
            bank_code: bankDetails.bankCode,
            currency: currencyCode,
        };
        const response = await this.client.post<CreateTransferRecipientResponseInterface>({
            url: "/transferrecipient",
            body,
        });

        const data = response.data;
        const recipient: TransferRecipient = {
            accountNumber: data.details.account_number,
            recipientId: data.recipient_code,
            bankCode: data.details.bank_code,
            currency: currencyCode,
        };

        await runQuery(queries.createTransferRecipient(recipient), this.pool);

        return recipient;
    };

    sendMoney: PaymentProviderRepoInterface["sendMoney"] = async (dto) => {
        try {
            const recipient = await this.getOrCreateTransferRecipient(
                dto.bankDetails,
                dto.currencyCode
            );

            const body = {
                source: "balance",
                reason: "Wallet withdrawal",
                amount: this.convertAmountToPaystack(dto.amount),
                recipient: recipient.recipientId,
            };

            const response = await this.client.post<SendMoneyResponseInterface>({
                url: "/transfer",
                body,
            });

            const data = response.data;
            if (data.status !== "pending")
                throw new Error(`request succeeded but returned transfer status: ${data.status}`);
            return data.transfer_code;
        } catch (err) {
            let message = "";
            if (err instanceof HttpError) {
                message = `${err.message} (statusCode: ${err.statusCode})`;
            } else {
                if (err instanceof Error) message = err.message;
            }

            throw new SendMoneyError(message, "paystack", dto);
        }
    };
}
