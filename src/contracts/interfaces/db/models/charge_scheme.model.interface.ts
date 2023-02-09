import { BusinessModelInterface } from "./business.model.interface";
import { ChargeSchemeModelInterfaceDef } from "./definitions";
import { WalletModelInterface } from "./wallet.model.interface";

export interface ChargeSchemeModelInterface extends ChargeSchemeModelInterfaceDef {
    wallets?: WalletModelInterface[];
    business?: BusinessModelInterface;
}
