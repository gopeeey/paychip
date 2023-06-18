import { BaseModelInterface } from "@bases/logic";
import { ChargeInterface } from "@charges/logic";

export interface CurrencyModelInterfaceDef extends BaseModelInterface {
    isoCode: string;
    name: string;
    active: boolean;
    fundingCs: ChargeInterface[];
    withdrawalCs: ChargeInterface[];
    walletInCs: ChargeInterface[];
    walletOutCs: ChargeInterface[];
}
