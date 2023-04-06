import { BusinessModelInterfaceDef } from "@logic/business";
import { WalletModelInterfaceDef } from "./wallet.def.model.interface";
import { CustomerModelInterfaceDef } from "@logic/customer";
import { ChargeStackModelInterfaceDef } from "@logic/charges";

export interface WalletModelInterface extends WalletModelInterfaceDef {
    business?: BusinessModelInterfaceDef;
    parentWallet?: WalletModelInterfaceDef;
    customers?: CustomerModelInterfaceDef[];
}
