import { BusinessModelInterfaceDef } from "@business/logic";
import { WalletModelInterfaceDef } from "./wallet.def.model.interface";
import { CustomerModelInterfaceDef } from "@logic/customer";
import { ChargeStackModelInterfaceDef } from "@charges/logic";

export interface WalletModelInterface extends WalletModelInterfaceDef {
    business?: BusinessModelInterfaceDef;
    parentWallet?: WalletModelInterfaceDef;
    customers?: CustomerModelInterfaceDef[];
}
