import { BankDetails } from "./bank_details.dto";

type Props = {
    bankDetails: BankDetails;
    reference: string;
    currencyCode: string;
    amount: number;
    provider: string;
};

export class SendMoneyDto {
    bankDetails: Props["bankDetails"];
    reference: Props["reference"];
    currencyCode: Props["currencyCode"];
    amount: Props["amount"];
    provider: Props["provider"];

    constructor(body: Props) {
        this.bankDetails = body.bankDetails;
        this.reference = body.reference;
        this.currencyCode = body.currencyCode;
        this.amount = body.amount;
        this.provider = body.provider;
    }
}
