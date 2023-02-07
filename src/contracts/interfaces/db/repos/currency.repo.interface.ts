import { BusinessModelInterface, CurrencyModelInterface } from "../models";

export interface CurrencyRepoInterface {
    getAll: () => Promise<CurrencyModelInterface[]>;

    getBusinessCurrencies: (
        businessId: BusinessModelInterface["id"]
    ) => Promise<CurrencyModelInterface[]>;

    addBusinessCurrencies: (
        businessId: BusinessModelInterface["id"],
        currencyCodes: CurrencyModelInterface["isoCode"][]
    ) => Promise<CurrencyModelInterface[]>;

    // removeBusinessCurrencies: (
    //     businessId: BusinessModelInterface["id"],
    //     currencyCodes: CurrencyModelInterface["isoCode"]
    // ) => Promise<CurrencyModelInterface[]>;
}
