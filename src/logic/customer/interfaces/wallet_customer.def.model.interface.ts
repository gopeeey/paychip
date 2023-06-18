import { BaseModelInterface } from "@bases/logic";
import { WalletModelInterfaceDef } from "@logic/wallet";
import { CustomerModelInterfaceDef } from "./customer.def.model.interface";

export interface WalletCustomerModelInterfaceDef extends BaseModelInterface {
    walletId: WalletModelInterfaceDef["id"];
    customerId: CustomerModelInterfaceDef["id"];
}
