import { BaseModelInterface } from "../base.model.interface";
import { BusinessModelInterfaceDef } from "./business.def.model.interface";
import { CurrencyModelInterfaceDef } from "./currency.def.model.interface";

export interface WalletModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    parentWalletId: string | null;
    currency: CurrencyModelInterfaceDef["isoCode"];
    balance: number;
    waiveFundingCharges: boolean;
    waiveWithdrawalCharges: boolean;
    email: string;
}
