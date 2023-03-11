import { WalletModelInterface } from "../interfaces";

export type AddChargeStackDtoProps = {
    walletId: WalletModelInterface["id"];
    chargeStackId: WalletModelInterface["fundingChargeStackId"];
    transactionType: "funding" | "withdrawal" | "walletIn" | "walletOut";
};

export class AddChargeStackDto implements AddChargeStackDtoProps {
    walletId: AddChargeStackDtoProps["walletId"];
    chargeStackId: AddChargeStackDtoProps["chargeStackId"];
    transactionType: AddChargeStackDtoProps["transactionType"];

    constructor(body: AddChargeStackDtoProps) {
        this.walletId = body.walletId;
        this.chargeStackId = body.chargeStackId;
        this.transactionType = body.transactionType;
    }
}
