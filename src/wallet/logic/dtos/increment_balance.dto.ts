import { SessionInterface } from "@bases/logic";
import { WalletModelInterface } from "../interfaces";

type RequiredProps = {
    walletId: WalletModelInterface["id"];
    amount: number;
    session?: SessionInterface;
};
export class IncrementBalanceDto implements RequiredProps {
    walletId: WalletModelInterface["id"];
    amount: number;
    session?: SessionInterface;

    constructor(body: RequiredProps) {
        this.walletId = body.walletId;
        this.amount = body.amount;
        this.session = body.session;
    }
}
