import { BusinessModelInterface, CurrencyModelInterface, CurrencyRepoInterface } from "../../../db";

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
