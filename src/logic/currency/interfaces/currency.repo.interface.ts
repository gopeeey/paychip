import { CurrencyModelInterface } from "./currency.model.interface";

export interface CurrencyRepoInterface {
    getAll: () => Promise<CurrencyModelInterface[]>;
    getActive: () => Promise<CurrencyModelInterface[]>;
}
