import { CustomerModelInterfaceDef } from "@logic/customer";
import { WalletModelInterfaceDef } from "@logic/wallet";
import { BaseModelInterface } from "@logic/types";
import { ChargeStackModelInterfaceDef, PaidByType } from "@logic/charges";
import { BusinessModelInterfaceDef } from "@logic/business";
import { CurrencyModelInterfaceDef } from "@logic/currency";
import { BusinessWalletModelInterfaceDef } from "@logic/business_wallet";

export const allowedTransactionTypes = ["credit", "debit"] as const;
export type TransactionType = (typeof allowedTransactionTypes)[number];

export const allowedTransactionChannels = ["bank", "card", "wallet"] as const;
export type TransactionChannelType = (typeof allowedTransactionChannels)[number];

export const allowedStatuses = ["pending", "successful", "failed"] as const;
export type TransactionStatusType = (typeof allowedStatuses)[number];

export const allowedPaymentProviders = ["paystack"] as const;
export const allowedTransferProviders = ["flutterwave"] as const;
export type PaymentProviderType = (typeof allowedPaymentProviders)[number];
export type TransferProviderType = (typeof allowedTransferProviders)[number];
export type TransactionProviderType = PaymentProviderType | TransferProviderType;

export interface TransactionModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    customerId: CustomerModelInterfaceDef["id"];
    transactionType: TransactionType;
    currency: CurrencyModelInterfaceDef["isoCode"];
    bwId: BusinessWalletModelInterfaceDef["id"];
    status: TransactionStatusType;
    channel: TransactionChannelType;
    amount: number;
    settledAmount: number;
    senderPaid: number;
    receiverPaid: number;
    businessPaid: number;
    businessCharge: number;
    platformCharge: number;
    businessGot: number;
    platformGot: number;
    businessChargePaidBy: PaidByType;
    platformChargePaidBy: PaidByType;
    senderWalletId?: WalletModelInterfaceDef["id"];
    receiverWalletId?: WalletModelInterfaceDef["id"];
    provider?: PaymentProviderType;
    providerRef?: string;
    bankName?: string;
    accountNumber?: string;
    bankCode?: string;
    accountName?: string;
    cardNumber?: string;
    cardType?: string;
}
