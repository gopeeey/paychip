import { WalletModelInterface } from "../interfaces";

type Props = {
    amount: number;
    walletId: WalletModelInterface["id"];
    accountNumber: string;
    bankCode: string;
};

export class InitializeWithdrawalDto {
    amount: Props["amount"];
    walletId: Props["walletId"];
    accountNumber: Props["accountNumber"];
    bankCode: Props["bankCode"];

    constructor(body: Props) {
        this.amount = body.amount;
        this.walletId = body.walletId;
        this.accountNumber = body.accountNumber;
        this.bankCode = body.bankCode;
    }
}
