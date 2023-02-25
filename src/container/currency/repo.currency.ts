import { Currency, BusinessCurrency, CurrencyRepo } from "@data/currency";

export const currencyRepo = new CurrencyRepo(Currency, BusinessCurrency);
