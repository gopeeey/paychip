import { WalletChargeStackModelInterface } from "../interfaces";

type RequiredProps = Pick<
    WalletChargeStackModelInterface,
    "walletId" | "chargeStackId" | "chargeType"
>;

export class GetWalletChargeStackDto implements RequiredProps {
    walletId: WalletChargeStackModelInterface["walletId"];
    chargeStackId: WalletChargeStackModelInterface["chargeStackId"];
    chargeType: WalletChargeStackModelInterface["chargeType"];

    constructor(body: RequiredProps) {
        this.walletId = body.walletId;
        this.chargeStackId = body.chargeStackId;
        this.chargeType = body.chargeType;
    }
}
