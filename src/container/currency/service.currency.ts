import { CurrencyService } from "@logic/currency";
import { currencyRepo } from "./repo.currency";

export const currencyService = new CurrencyService({
    repo: currencyRepo,
});

export const updateBusinessCurrencies = currencyService.updateBusinessCurrencies;

export const isSupportedBusinessCurrency = currencyService.isSupportedBusinessCurrency;
