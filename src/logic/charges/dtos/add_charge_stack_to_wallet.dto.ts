import { WalletChargeStackModelInterface } from "../interfaces";

type RequiredProps = Pick<
    WalletChargeStackModelInterface,
    "walletId" | "chargeStackId" | "chargeStackType"
>;

export class AddChargeStackToWalletDto implements RequiredProps {
    walletId: WalletChargeStackModelInterface["walletId"];
    chargeStackId: WalletChargeStackModelInterface["chargeStackId"];
    chargeStackType: WalletChargeStackModelInterface["chargeStackType"];

    constructor(body: RequiredProps) {
        this.walletId = body.walletId;
        this.chargeStackId = body.chargeStackId;
        this.chargeStackType = body.chargeStackType;
    }
}
