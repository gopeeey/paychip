import { BusinessModelInterface } from "./business.model.interface";
import {
    ChargeSchemeModelInterfaceDef,
    CustomerModelInterfaceDef,
    WalletModelInterfaceDef,
} from "./definitions";

export interface WalletModelInterface extends WalletModelInterfaceDef {
    business?: BusinessModelInterface;
    parentWallet?: WalletModelInterfaceDef;
    customers?: CustomerModelInterfaceDef[];
    chargeScheme?: ChargeSchemeModelInterfaceDef;
}
