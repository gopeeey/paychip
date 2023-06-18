import { BusinessModelInterface } from "@business/logic";
import { SessionInterface } from "@bases/logic";
import { CurrencyModelInterface } from "./currency.model.interface";
import { CurrencyRepoInterface } from "./currency.repo.interface";

export interface CurrencyServiceInterface {
    getActive: () => Promise<CurrencyModelInterface[]>;
    validateIsSupported: (currencyCode: CurrencyModelInterface["isoCode"]) => Promise<void>;
    getCurrencyByIsoCode: (
        code: CurrencyModelInterface["isoCode"]
    ) => Promise<CurrencyModelInterface>;
}

export interface CurrencyServiceDependencies {
    repo: CurrencyRepoInterface;
}
