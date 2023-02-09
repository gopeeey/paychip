import { Currency, BusinessCurrency } from "../../db/models";
import { CurrencyRepo } from "../../db/repos";

export const currencyRepo = new CurrencyRepo(Currency, BusinessCurrency);
