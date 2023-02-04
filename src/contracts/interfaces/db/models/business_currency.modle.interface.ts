import { BusinessModelInterface } from "./business.model.interface";
import { CurrencyModelInterface } from "./currency.model.interface";

export interface BusinessCurrencyModelInterface {
    businessId: BusinessModelInterface["id"];
    currencyIsoCode: CurrencyModelInterface["isoCode"];
    business?: BusinessModelInterface;
    currency?: CurrencyModelInterface;
}
