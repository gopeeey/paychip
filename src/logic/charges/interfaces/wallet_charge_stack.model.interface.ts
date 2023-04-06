import { BaseModelInterface } from "@logic/types";
import { WalletModelInterfaceDef } from "@logic/wallet";
import { ChargeStackModelInterfaceDef } from "./charge_stack.def.model.interface";

export const allowedChargeStackTypes = [
    "funding",
    "withdrawal",
    "wallet-in",
    "wallet-out",
] as const;
export type ChargeStackType = typeof allowedChargeStackTypes[number];

export interface WalletChargeStackModelInterface extends BaseModelInterface {
    id: string;
    walletId: WalletModelInterfaceDef["id"];
    chargeStackId: ChargeStackModelInterfaceDef["id"];
    chargeStackType: ChargeStackType;
}
