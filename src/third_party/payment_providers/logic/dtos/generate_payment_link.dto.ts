import { TransactionChannelType } from "@transaction/logic";

type ArgsType = {
    amount: number;
    walletId: string;
    reference: string;
    currency: string;
    allowedChannels: Exclude<TransactionChannelType, "wallet">[];
};

export class GeneratePaymentLinkDto {
    amount: ArgsType["amount"];
    walletId: ArgsType["walletId"];
    reference: ArgsType["reference"];
    currency: ArgsType["currency"];
    allowedChannels: ArgsType["allowedChannels"];

    constructor(body: ArgsType) {
        this.amount = body.amount;
        this.walletId = body.walletId;
        this.reference = body.reference;
        this.currency = body.currency;
        this.allowedChannels = body.allowedChannels;
    }
}
