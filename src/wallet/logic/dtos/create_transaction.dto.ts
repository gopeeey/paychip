import { TransactionModelInterface } from "../interfaces";

interface RequiredProps
    extends Omit<TransactionModelInterface, "id" | "status" | "customer" | "channel"> {
    channel: TransactionModelInterface["channel"] | null;
    status?: TransactionModelInterface["status"];
}

export class CreateTransactionDto implements RequiredProps {
    businessId: TransactionModelInterface["businessId"];
    customerId: TransactionModelInterface["customerId"];
    transactionType: TransactionModelInterface["transactionType"];
    currency: TransactionModelInterface["currency"];
    bwId: TransactionModelInterface["bwId"];
    channel: TransactionModelInterface["channel"] | null;
    status: TransactionModelInterface["status"];
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
    reference: TransactionModelInterface["reference"];
    provider: TransactionModelInterface["provider"];
    providerRef: TransactionModelInterface["providerRef"];
    bankName: TransactionModelInterface["bankName"];
    accountNumber: TransactionModelInterface["accountNumber"];
    bankCode: TransactionModelInterface["bankCode"];
    accountName: TransactionModelInterface["accountName"];
    cardNumber: TransactionModelInterface["cardNumber"];
    cardType: TransactionModelInterface["cardType"];
    callbackUrl: TransactionModelInterface["callbackUrl"];
    senderWalletId: TransactionModelInterface["senderWalletId"];
    receiverWalletId: TransactionModelInterface["receiverWalletId"];

    constructor({ status = "pending", ...body }: RequiredProps) {
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
        this.reference = body.reference;
        this.provider = body.provider || null;
        this.providerRef = body.providerRef || null;
        this.bankName = body.bankName || null;
        this.accountNumber = body.accountNumber || null;
        this.bankCode = body.bankCode || null;
        this.accountName = body.accountName || null;
        this.cardNumber = body.cardNumber || null;
        this.cardType = body.cardType || null;
        this.status = status;
        this.callbackUrl = body.callbackUrl || null;
        this.senderWalletId = body.senderWalletId || null;
        this.receiverWalletId = body.receiverWalletId || null;
    }
}
