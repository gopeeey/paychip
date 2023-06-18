import { BaseModelInterface } from "@bases/logic";
import { WalletModelInterfaceDef } from "@logic/wallet";
import { ChargeStackModelInterfaceDef } from "./charge_stack.def.model.interface";

export const allowedChargeTypes = ["funding", "withdrawal", "walletIn", "walletOut"] as const;
export type ChargeType = (typeof allowedChargeTypes)[number];

export interface WalletChargeStackModelInterface extends BaseModelInterface {
    id: string;
    walletId: WalletModelInterfaceDef["id"];
    chargeStackId: ChargeStackModelInterfaceDef["id"];
    chargeType: ChargeType;
}
