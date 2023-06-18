import { TransactionModelInterface } from "@logic/transaction";

type ArgsType = {
    status: "successful" | "failed";
    channel: TransactionModelInterface["channel"] | null;
    provider: TransactionModelInterface["provider"];
    providerRef: TransactionModelInterface["providerRef"];
    bankName: TransactionModelInterface["bankName"];
    accountNumber: TransactionModelInterface["accountNumber"];
    accountName: TransactionModelInterface["accountName"];
    cardNumber: TransactionModelInterface["cardNumber"];
    cardType: TransactionModelInterface["cardType"];
    reference: TransactionModelInterface["id"];
};

export class VerifyTransactionResponseDto implements ArgsType {
    status: ArgsType["status"];
    channel: ArgsType["channel"];
    provider: ArgsType["provider"];
    providerRef: ArgsType["providerRef"];
    bankName: ArgsType["bankName"];
    accountNumber: ArgsType["accountNumber"];
    accountName: ArgsType["accountName"];
    cardNumber: ArgsType["cardNumber"];
    cardType: ArgsType["cardType"];
    reference: ArgsType["reference"];

    constructor(body: ArgsType) {
        this.status = body.status;
        this.channel = body.channel;
        this.provider = body.provider;
        this.providerRef = body.providerRef;
        this.bankName = body.bankName;
        this.accountNumber = body.accountNumber;
        this.accountName = body.accountName;
        this.cardNumber = body.cardNumber;
        this.cardType = body.cardType;
        this.reference = body.reference;
    }
}
