import { CustomerModelInterfaceDef } from "@logic/customer";
import { WalletModelInterfaceDef } from "@logic/wallet";

const allowedTransactionTypes = ["credit", "debit"] as const;
export type TransactionType = typeof allowedTransactionTypes[number];

export const allowedTransactionChannels = ["bank", "card", "wallet"] as const;
export type TransactionChannelType = typeof allowedTransactionChannels[number];

export interface TransactionModelInterfaceDef {
    id: string;
    walletId: WalletModelInterfaceDef["id"];
    customerId: CustomerModelInterfaceDef["id"];
    transactionType: TransactionType;
    channel: TransactionChannelType;
    amount: number;
    settledAmount: number;
    charge: number;
    // provider:
}
