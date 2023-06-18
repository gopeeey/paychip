import { CustomerModelInterfaceDef } from "@customer/logic";
import { WalletModelInterfaceDef } from "@wallet/logic";
import { BaseModelInterface } from "@bases/logic";
import { ChargeStackModelInterfaceDef, PaidByType } from "@charges/logic";
import { BusinessModelInterfaceDef } from "@business/logic";
import { CurrencyModelInterfaceDef } from "@currency/logic";
import { BusinessWalletModelInterfaceDef } from "@business_wallet/logic";

export const allowedTransactionTypes = ["credit", "debit"] as const;
export type TransactionType = (typeof allowedTransactionTypes)[number];

export const allowedTransactionChannels = ["bank", "card", "wallet"] as const;
export type TransactionChannelType = (typeof allowedTransactionChannels)[number];

export const allowedStatuses = ["pending", "successful", "failed"] as const;
export type TransactionStatusType = (typeof allowedStatuses)[number];

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
    businessChargePaidBy: PaidByType | null;
    platformChargePaidBy: PaidByType;
    reference: string;
    provider?: string | null;
    providerRef?: string | null;
    bankName?: string | null;
    accountNumber?: string | null;
    bankCode?: string | null;
    accountName?: string | null;
    cardNumber?: string | null;
    cardType?: string | null;
    callbackUrl?: string | null;
    senderWalletId?: WalletModelInterfaceDef["id"] | null;
    receiverWalletId?: WalletModelInterfaceDef["id"] | null;
}
