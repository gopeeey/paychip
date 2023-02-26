import { CustomerModelInterfaceDef } from "@logic/customer";
import { WalletModelInterfaceDef } from "@logic/wallet";
import { BaseModelInterface } from "@logic/types";

export const allowedTransactionTypes = ["credit", "debit"] as const;
export type TransactionType = typeof allowedTransactionTypes[number];

export const allowedTransactionChannels = ["bank", "card", "wallet"] as const;
export type TransactionChannelType = typeof allowedTransactionChannels[number];

export const allowedPaymentProviders = ["paystack"] as const;
export const allowedTransferProviders = ["flutterwave"] as const;
export type PaymentProviderType = typeof allowedPaymentProviders[number];
export type TransferProviderType = typeof allowedTransferProviders[number];
export type TransactionProviderType = PaymentProviderType | TransferProviderType;

export interface TransactionModelInterfaceDef extends BaseModelInterface {
    id: string;
    walletId: WalletModelInterfaceDef["id"];
    customerId: CustomerModelInterfaceDef["id"];
    transactionType: TransactionType;
    channel: TransactionChannelType;
    amount: number;
    settledAmount: number;
    charge: number;
    provider?: TransactionProviderType;
    providerRef?: string;
    bankName?: string;
    accountNumber?: string;
    bankCode?: string;
    accountName?: string;
    cardNumber?: string;
    cardType?: string;
    senderWalletId?: string;
    receiverWalletId?: string;
}
