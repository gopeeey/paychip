import { BusinessModelInterface } from "@logic/business";
import { CurrencyModelInterface } from "./currency.model.interface";
import { CurrencyRepoInterface } from "./currency.repo.interface";

export interface CurrencyServiceInterface {
    updateBusinessCurrencies: (
        businessId: BusinessModelInterface["id"],
        currencyCodes: CurrencyModelInterface["isoCode"][]
    ) => Promise<CurrencyModelInterface[]>;

    getBusinessCurrencies: (
        businessId: BusinessModelInterface["id"]
    ) => Promise<CurrencyModelInterface[]>;

    isSupportedBusinessCurrency: (
        businessId: BusinessModelInterface["id"],
        currencyCode: CurrencyModelInterface["isoCode"]
    ) => Promise<boolean>;
}

export interface CurrencyServiceDependencies {
    repo: CurrencyRepoInterface;
}
