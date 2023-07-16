import { TransactionModelInterface } from "../interfaces";

type RequiredProps = {
    status: TransactionModelInterface["status"];
    channel: TransactionModelInterface["channel"];
    providerRef: TransactionModelInterface["providerRef"];
    bankName?: TransactionModelInterface["bankName"];
    accountNumber?: TransactionModelInterface["accountNumber"];
    accountName?: TransactionModelInterface["accountName"];
    cardNumber?: TransactionModelInterface["cardNumber"];
    cardType?: TransactionModelInterface["cardType"];
};

export class UpdateTransactionInfoDto {
    status: RequiredProps["status"];
    channel: RequiredProps["channel"];
    providerRef: RequiredProps["providerRef"];
    bankName: RequiredProps["bankName"];
    accountNumber: RequiredProps["accountNumber"];
    accountName: RequiredProps["accountName"];
    cardNumber: RequiredProps["cardNumber"];
    cardType: RequiredProps["cardType"];

    constructor(body: RequiredProps) {
        this.status = body.status;
        this.channel = body.channel;
        this.providerRef = body.providerRef;
        this.bankName = body.bankName;
        this.accountNumber = body.accountNumber;
        this.accountName = body.accountName;
        this.cardNumber = body.cardNumber;
        this.cardType = body.cardType;
    }
}
