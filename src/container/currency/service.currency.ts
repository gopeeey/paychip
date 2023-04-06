import { CurrencyService } from "@logic/currency";
import { currencyRepo } from "./repo.currency";

export const currencyService = new CurrencyService({
    repo: currencyRepo,
});

export const validateCurrencySupported = currencyService.validateIsSupported;
