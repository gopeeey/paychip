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

    getAll = async () => {
        const currencies = await this._currencyModelContext.findAll({});
        return currencies.map((currency) => currency.toJSON());
    };

    getBusinessCurrencies = async (businessId: BusinessModelInterface["id"]) => {
        const businessCurrencies = await this._businessCurrencyModelContext.findAll({
            where: { businessId },
            include: "currency",
        });
        return businessCurrencies.reduce((agg, businessCurrency) => {
            if (!businessCurrency.currency) return agg;
            return [...agg, businessCurrency.currency];
        }, [] as CurrencyModelInterface[]);
    };

    addBusinessCurrencies = async (
        businessId: BusinessModelInterface["id"],
        currencyCodes: CurrencyModelInterface["isoCode"][]
    ) => {
        const businessCurrencies = await this._businessCurrencyModelContext.bulkCreate(
            currencyCodes.map((code) => ({ businessId, currencyIsoCode: code }))
        );
        const addedCodes = businessCurrencies.map((curr) => curr.currencyIsoCode);
        const currencies = await this._currencyModelContext.findAll({
            where: { isoCode: addedCodes },
        });
        return currencies.map((currency) => currency.toJSON());
    };

    updateBusinessCurrencies = async (
        businessId: BusinessModelInterface["id"],
        currencyCodes: CurrencyModelInterface["isoCode"][]
    ) => {
        await this._businessCurrencyModelContext.destroy({ where: { businessId } });
        if (!currencyCodes.length) return [];
        const currencies = await this.addBusinessCurrencies(businessId, currencyCodes);
        return currencies;
    };
}
