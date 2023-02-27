import { BusinessModelInterfaceDef } from "@logic/business";
import { WalletModelInterfaceDef } from "./wallet.def.model.interface";
import { CustomerModelInterfaceDef } from "@logic/customer";
import { ChargeSchemeModelInterfaceDef } from "@logic/charge_scheme";

export interface WalletModelInterface extends WalletModelInterfaceDef {
    business?: BusinessModelInterfaceDef;
    parentWallet?: WalletModelInterfaceDef;
    customers?: CustomerModelInterfaceDef[];
    fundingChargeScheme?: ChargeSchemeModelInterfaceDef;
    withdrawalChargeScheme?: ChargeSchemeModelInterfaceDef;
    walletInChargeScheme?: ChargeSchemeModelInterfaceDef;
    walletOutChargeScheme?: ChargeSchemeModelInterfaceDef;
}
