import { TransactionModelInterface } from "../interfaces";

type RequiredProps = Pick<
    TransactionModelInterface,
    | "walletId"
    | "businessId"
    | "amount"
    | "settledAmount"
    | "channel"
    | "transactionType"
    | "status"
    | "charge"
    | "chargePaidBy"
    | "customerId"
    | "provider"
    | "providerRef"
    | "senderWalletId"
    | "receiverWalletId"
    | "accountName"
    | "accountNumber"
    | "bankCode"
    | "bankName"
    | "cardNumber"
    | "cardType"
>;

export class CreateTransactionDto implements RequiredProps {
    walletId: TransactionModelInterface["walletId"];
    businessId: TransactionModelInterface["businessId"];
    amount: TransactionModelInterface["amount"];
    settledAmount: TransactionModelInterface["settledAmount"];
    channel: TransactionModelInterface["channel"];
    transactionType: TransactionModelInterface["transactionType"];
    status: TransactionModelInterface["status"] = "pending";
    charge: TransactionModelInterface["charge"];
    chargePaidBy: TransactionModelInterface["chargePaidBy"];
    customerId: TransactionModelInterface["customerId"];
    provider: TransactionModelInterface["provider"];
    providerRef: TransactionModelInterface["providerRef"];
    senderWalletId: TransactionModelInterface["senderWalletId"];
    receiverWalletId: TransactionModelInterface["receiverWalletId"];
    accountName: TransactionModelInterface["accountName"];
    accountNumber: TransactionModelInterface["accountNumber"];
    bankCode: TransactionModelInterface["bankCode"];
    bankName: TransactionModelInterface["bankName"];
    cardNumber: TransactionModelInterface["cardNumber"];
    cardType: TransactionModelInterface["cardType"];

    constructor(body: RequiredProps) {
        this.walletId = body.walletId;
        this.businessId = body.businessId;
        this.amount = body.amount;
        this.settledAmount = body.settledAmount;
        this.channel = body.channel;
        this.transactionType = body.transactionType;
        this.status = body.status;
        this.charge = body.charge;
        this.chargePaidBy = body.chargePaidBy;
        this.customerId = body.customerId;
        this.provider = body.provider || null;
        this.providerRef = body.providerRef || null;
        this.senderWalletId = body.senderWalletId || null;
        this.receiverWalletId = body.receiverWalletId || null;
        this.accountName = body.accountName || null;
        this.accountNumber = body.accountNumber || null;
        this.bankCode = body.bankCode || null;
        this.bankName = body.bankName || null;
        this.cardNumber = body.cardNumber || null;
        this.cardType = body.cardType || null;
    }
}
