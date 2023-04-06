import { CustomerModelInterfaceDef } from "@logic/customer";
import { WalletModelInterfaceDef } from "@logic/wallet";
import { BaseModelInterface } from "@logic/types";
import { ChargeStackModelInterfaceDef } from "@logic/charges";
import { BusinessModelInterfaceDef } from "@logic/business";

export const allowedTransactionTypes = ["credit", "debit"] as const;
export type TransactionType = typeof allowedTransactionTypes[number];

export const allowedTransactionChannels = ["bank", "card", "wallet"] as const;
export type TransactionChannelType = typeof allowedTransactionChannels[number];

export const allowedStatuses = ["pending", "successful", "failed"] as const;
export type TransactionStatusType = typeof allowedStatuses[number];

export const allowedPaymentProviders = ["paystack"] as const;
export const allowedTransferProviders = ["flutterwave"] as const;
export type PaymentProviderType = typeof allowedPaymentProviders[number];
export type TransferProviderType = typeof allowedTransferProviders[number];
export type TransactionProviderType = PaymentProviderType | TransferProviderType;

export interface TransactionModelInterfaceDef extends BaseModelInterface {
    id: string;
    walletId: WalletModelInterfaceDef["id"];
    customerId?: CustomerModelInterfaceDef["id"];
    businessId: BusinessModelInterfaceDef["id"];
    transactionType: TransactionType;
    status: TransactionStatusType;
    channel: TransactionChannelType;
    amount: number;
    settledAmount: number;
    charge: number;
    chargePaidBy: ChargeStackModelInterfaceDef["paidBy"];
    provider?: TransactionProviderType | null;
    providerRef?: string | null;
    bankName?: string | null;
    accountNumber?: string | null;
    bankCode?: string | null;
    accountName?: string | null;
    cardNumber?: string | null;
    cardType?: string | null;
    senderWalletId?: string | null;
    receiverWalletId?: string | null;
}
