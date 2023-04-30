import { TransactionModelInterface } from "../interfaces";

type RequiredProps = Omit<TransactionModelInterface, "id" | "status">;

export class CreateTransactionDto implements RequiredProps {
    businessId: TransactionModelInterface["businessId"];
    customerId: TransactionModelInterface["customerId"];
    transactionType: TransactionModelInterface["transactionType"];
    currency: TransactionModelInterface["currency"];
    bwId: TransactionModelInterface["bwId"];
    channel: TransactionModelInterface["channel"];
    amount: TransactionModelInterface["amount"];
    settledAmount: TransactionModelInterface["settledAmount"];
    senderPaid: TransactionModelInterface["senderPaid"];
    receiverPaid: TransactionModelInterface["receiverPaid"];
    businessPaid: TransactionModelInterface["businessPaid"];
    businessCharge: TransactionModelInterface["businessCharge"];
    platformCharge: TransactionModelInterface["platformCharge"];
    businessGot: TransactionModelInterface["businessGot"];
    platformGot: TransactionModelInterface["platformGot"];
    businessChargePaidBy: TransactionModelInterface["businessChargePaidBy"];
    platformChargePaidBy: TransactionModelInterface["platformChargePaidBy"];
    senderWalletId: TransactionModelInterface["senderWalletId"];
    receiverWalletId: TransactionModelInterface["receiverWalletId"];
    provider: TransactionModelInterface["provider"];
    providerRef: TransactionModelInterface["providerRef"];
    bankName: TransactionModelInterface["bankName"];
    accountNumber: TransactionModelInterface["accountNumber"];
    bankCode: TransactionModelInterface["bankCode"];
    accountName: TransactionModelInterface["accountName"];
    cardNumber: TransactionModelInterface["cardNumber"];
    cardType: TransactionModelInterface["cardType"];

    constructor(body: RequiredProps) {
        this.businessId = body.businessId;
        this.customerId = body.customerId;
        this.transactionType = body.transactionType;
        this.currency = body.currency;
        this.bwId = body.bwId;
        this.channel = body.channel;
        this.amount = body.amount;
        this.settledAmount = body.settledAmount;
        this.senderPaid = body.senderPaid;
        this.receiverPaid = body.receiverPaid;
        this.businessPaid = body.businessPaid;
        this.businessCharge = body.businessCharge;
        this.platformCharge = body.platformCharge;
        this.businessGot = body.businessGot;
        this.platformGot = body.platformGot;
        this.businessChargePaidBy = body.businessChargePaidBy;
        this.platformChargePaidBy = body.platformChargePaidBy;
        this.senderWalletId = body.senderWalletId;
        this.receiverWalletId = body.receiverWalletId;
        this.provider = body.provider;
        this.providerRef = body.providerRef;
        this.bankName = body.bankName;
        this.accountNumber = body.accountNumber;
        this.bankCode = body.bankCode;
        this.accountName = body.accountName;
        this.cardNumber = body.cardNumber;
        this.cardType = body.cardType;
    }
}
