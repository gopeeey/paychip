import { BusinessModelInterface, CurrencyModelInterface, CurrencyRepoInterface } from "../../../db";

export interface CurrencyServiceInterface {
    updateBusinessCurrencies: (
        businessId: BusinessModelInterface["id"],
        currencyCodes: CurrencyModelInterface["isoCode"][]
    ) => Promise<CurrencyModelInterface[]>;
}

export interface CurrencyServiceDependencies {
    repo: CurrencyRepoInterface;
}
