import { BusinessModelInterfaceDef } from "@logic/business";
import { ChargeSchemeModelInterfaceDef } from "./charge_scheme.def.model.interface";
import { WalletModelInterfaceDef } from "@logic/wallet";

export interface ChargeSchemeModelInterface extends ChargeSchemeModelInterfaceDef {
    wallets?: WalletModelInterfaceDef[];
    business?: BusinessModelInterfaceDef;
}
