import { BusinessModelInterfaceDef } from "@logic/business";
import { CurrencyModelInterface } from "./currency.model.interface";

export interface BusinessCurrencyModelInterface {
    businessId: BusinessModelInterfaceDef["id"];
    currencyIsoCode: CurrencyModelInterface["isoCode"];
    business?: BusinessModelInterfaceDef;
    currency?: CurrencyModelInterface;
}
