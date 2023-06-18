import { BaseModelInterface } from "@bases/logic";
import { WalletModelInterfaceDef } from "@wallet/logic";
import { CustomerModelInterfaceDef } from "./customer.def.model.interface";

export interface WalletCustomerModelInterfaceDef extends BaseModelInterface {
    walletId: WalletModelInterfaceDef["id"];
    customerId: CustomerModelInterfaceDef["id"];
}
