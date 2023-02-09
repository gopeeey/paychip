import { CurrencyService } from "../../logic/services";
import { currencyRepo } from "./repo.currency";

export const currencyService = new CurrencyService({
    repo: currencyRepo,
});

export const updateBusinessCurrencies = currencyService.updateBusinessCurrencies;
