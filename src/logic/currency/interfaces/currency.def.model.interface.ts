import { BaseModelInterface } from "@logic/types";

export interface CurrencyModelInterfaceDef extends BaseModelInterface {
    isoCode: string;
    name: string;
    fundingCs: string;
    withdrawalCs: string;
    walletInCs: string;
    walletOutCs: string;
}
