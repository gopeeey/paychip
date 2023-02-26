import {
    BusinessCurrencyModelInterface,
    CurrencyModelInterface,
    CurrencyRepoInterface,
} from "@logic/currency";
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

    getBusinessCurrencies = async (businessId: BusinessCurrencyModelInterface["businessId"]) => {
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
        businessId: BusinessCurrencyModelInterface["businessId"],
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
        businessId: BusinessCurrencyModelInterface["businessId"],
        currencyCodes: CurrencyModelInterface["isoCode"][]
    ) => {
        await this._businessCurrencyModelContext.destroy({ where: { businessId } });
        if (!currencyCodes.length) return [];
        const currencies = await this.addBusinessCurrencies(businessId, currencyCodes);
        return currencies;
    };
}
