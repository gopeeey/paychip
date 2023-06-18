import { BusinessModelInterfaceDef } from "@business/logic";
import { CurrencyModelInterfaceDef } from "@logic/currency";
import { BusinessWalletModelInterfaceDef } from "./business_wallet.def.model.interface";

export interface BusinessWalletModelInterface extends BusinessWalletModelInterfaceDef {
    currency?: CurrencyModelInterfaceDef;
    business?: BusinessModelInterfaceDef;
}