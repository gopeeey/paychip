import { WalletModelInterface } from "../interfaces";

export type AddChargeSchemeDtoProps = {
    walletId: WalletModelInterface["id"];
    chargeSchemeId: WalletModelInterface["fundingChargeSchemeId"];
    transactionType: "funding" | "withdrawal" | "walletIn" | "walletOut";
};

export class AddChargeSchemeDto implements AddChargeSchemeDtoProps {
    walletId: AddChargeSchemeDtoProps["walletId"];
    chargeSchemeId: AddChargeSchemeDtoProps["chargeSchemeId"];
    transactionType: AddChargeSchemeDtoProps["transactionType"];

    constructor(body: AddChargeSchemeDtoProps) {
        this.walletId = body.walletId;
        this.chargeSchemeId = body.chargeSchemeId;
        this.transactionType = body.transactionType;
    }
}
