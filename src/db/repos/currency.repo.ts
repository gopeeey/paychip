import {
    BusinessModelInterface,
    CurrencyModelInterface,
    CurrencyRepoInterface,
} from "../../contracts/interfaces";
import { BusinessCurrency, Currency } from "../models";

export class CurrencyRepo implements CurrencyRepoInterface {
    constructor(
        private readonly _currencyModelContext: typeof Currency,
        private readonly _businessCurrencyModelContext: typeof BusinessCurrency
    ) {}

    async getAll() {
        const currencies = await this._currencyModelContext.findAll({});
        return currencies.map((currency) => currency.toJSON());
    }

    async getBusinessCurrencies(businessId: BusinessModelInterface["id"]) {
        const businessCurrencies = await this._businessCurrencyModelContext.findAll({
            where: { businessId },
            include: "currencies",
        });
        return businessCurrencies.reduce((agg, businessCurrency) => {
            if (!businessCurrency.currency) return agg;
            return [...agg, businessCurrency.currency];
        }, [] as CurrencyModelInterface[]);
    }
}
