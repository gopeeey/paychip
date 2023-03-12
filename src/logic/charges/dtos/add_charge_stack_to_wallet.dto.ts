import { WalletChargeStackModelInterface } from "../interfaces";

type RequiredProps = Pick<
    WalletChargeStackModelInterface,
    "walletId" | "chargeStackId" | "chargeStackType" | "isChildDefault"
>;

export class AddChargeStackToWalletDto implements RequiredProps {
    walletId: WalletChargeStackModelInterface["walletId"];
    chargeStackId: WalletChargeStackModelInterface["chargeStackId"];
    chargeStackType: WalletChargeStackModelInterface["chargeStackType"];
    isChildDefault: WalletChargeStackModelInterface["isChildDefault"];

    constructor(body: RequiredProps) {
        this.walletId = body.walletId;
        this.chargeStackId = body.chargeStackId;
        this.chargeStackType = body.chargeStackType;
        this.isChildDefault = body.isChildDefault;
    }
}
