import { CurrencyModelInterface } from "./currency.model.interface";

export interface CurrencyRepoInterface {
    getAll: () => Promise<CurrencyModelInterface[]>;
    getActive: () => Promise<CurrencyModelInterface[]>;
    getByIsoCode: (
        code: CurrencyModelInterface["isoCode"]
    ) => Promise<CurrencyModelInterface | null>;
}
