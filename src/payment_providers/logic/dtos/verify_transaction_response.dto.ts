import { CustomerModelInterface } from "@customer/logic";
import { TransactionModelInterface } from "@wallet/logic";

type ArgsType = {
    status: "successful" | "failed";
    amount: TransactionModelInterface["amount"];
    channel: TransactionModelInterface["channel"] | null;
    provider: TransactionModelInterface["provider"];
    providerRef: TransactionModelInterface["providerRef"];
    bankName: TransactionModelInterface["bankName"];
    accountNumber: TransactionModelInterface["accountNumber"];
    accountName: TransactionModelInterface["accountName"];
    cardNumber: TransactionModelInterface["cardNumber"];
    cardType: TransactionModelInterface["cardType"];
    reference: TransactionModelInterface["id"];
    walletId: Exclude<TransactionModelInterface["senderWalletId"], null | undefined>;
    customerName: CustomerModelInterface["name"];
    customerFirstName: CustomerModelInterface["firstName"];
    customerLastName: CustomerModelInterface["lastName"];
    customerPhone: CustomerModelInterface["phone"];
};

export class VerifyTransactionResponseDto implements ArgsType {
    status: ArgsType["status"];
    amount: ArgsType["amount"];
    channel: ArgsType["channel"];
    provider: ArgsType["provider"];
    providerRef: ArgsType["providerRef"];
    bankName: ArgsType["bankName"];
    accountNumber: ArgsType["accountNumber"];
    accountName: ArgsType["accountName"];
    cardNumber: ArgsType["cardNumber"];
    cardType: ArgsType["cardType"];
    reference: ArgsType["reference"];
    walletId: ArgsType["walletId"];
    customerName: ArgsType["customerName"];
    customerFirstName: ArgsType["customerFirstName"];
    customerLastName: ArgsType["customerLastName"];
    customerPhone: ArgsType["customerPhone"];

    constructor(body: ArgsType) {
        this.status = body.status;
        this.amount = body.amount;
        this.channel = body.channel;
        this.provider = body.provider;
        this.providerRef = body.providerRef;
        this.bankName = body.bankName;
        this.accountNumber = body.accountNumber;
        this.accountName = body.accountName;
        this.cardNumber = body.cardNumber;
        this.cardType = body.cardType;
        this.reference = body.reference;
        this.walletId = body.walletId;
        this.customerFirstName = body.customerFirstName;
        this.customerLastName = body.customerLastName;
        this.customerPhone = body.customerPhone;
        this.customerName = body.customerName;
    }
}
