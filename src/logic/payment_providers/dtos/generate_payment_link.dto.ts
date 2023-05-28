import { TransactionChannelType } from "@logic/transaction";

type ArgsType = {
    amount: number;
    walletId: string;
    transactionId: string;
    currency: string;
    allowedChannels: TransactionChannelType[];
};

export class GeneratePaymentLinkDto {
    amount: ArgsType["amount"];
    walletId: ArgsType["walletId"];
    transactionId: ArgsType["transactionId"];
    currency: ArgsType["currency"];
    allowedChannels: ArgsType["allowedChannels"];

    constructor(body: ArgsType) {
        this.amount = body.amount;
        this.walletId = body.walletId;
        this.transactionId = body.transactionId;
        this.currency = body.currency;
        this.allowedChannels = body.allowedChannels;
    }
}
