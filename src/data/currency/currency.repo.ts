import {
    BusinessCurrencyModelInterface,
    CurrencyModelInterface,
    CurrencyRepoInterface,
} from "@logic/currency";
import { Transaction } from "sequelize";
import { BusinessCurrency } from "./business_currency.model";
import { Currency } from "./currency.model";

export class CurrencyRepo implements CurrencyRepoInterface {
    constructor(
        private readonly _currencyModelContext: typeof Currency,
        private readonly _businessCurrencyModelContext: typeof BusinessCurrency
    ) {}

    getAll = async () => {
        const currencies = await this._currencyModelContext.findAll({});
        return currencies.map((currency) => currency.toJSON());
    };
}
