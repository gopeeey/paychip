import { BusinessModelInterface } from "@logic/business";
import { SessionInterface } from "@logic/session_interface";
import { CurrencyModelInterface } from "./currency.model.interface";

export interface CurrencyRepoInterface {
    getAll: () => Promise<CurrencyModelInterface[]>;

    getBusinessCurrencies: (
        businessId: BusinessModelInterface["id"]
    ) => Promise<CurrencyModelInterface[]>;

    addBusinessCurrencies: (
        businessId: BusinessModelInterface["id"],
        currencyCodes: CurrencyModelInterface["isoCode"][],
        session?: SessionInterface
    ) => Promise<CurrencyModelInterface[]>;

    updateBusinessCurrencies: (
        businessId: BusinessModelInterface["id"],
        currencyCodes: CurrencyModelInterface["isoCode"][],
        session?: SessionInterface
    ) => Promise<CurrencyModelInterface[]>;

    // removeBusinessCurrencies: (
    //     businessId: BusinessModelInterface["id"],
    //     currencyCodes: CurrencyModelInterface["isoCode"]
    // ) => Promise<CurrencyModelInterface[]>;
}
