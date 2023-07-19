type Props = {
    accountNumber: string;
    bankCode: string;
    accountName?: string;
};

export class BankDetails {
    accountNumber: Props["accountNumber"];
    bankCode: Props["bankCode"];
    accountName: Props["accountName"];

    constructor(body: Props) {
        this.accountNumber = body.accountNumber;
        this.bankCode = body.bankCode;
        this.accountName = body.accountName;
    }
}
