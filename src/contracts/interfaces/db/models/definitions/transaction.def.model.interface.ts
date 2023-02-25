import { CustomerModelInterfaceDef } from "./customer.def.model.interface";
import { WalletModelInterfaceDef } from "./wallet.def.model.interface";

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
