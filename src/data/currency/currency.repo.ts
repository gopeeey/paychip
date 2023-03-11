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

    getBusinessCurrencies = async (businessId: BusinessCurrencyModelInterface["businessId"]) => {
        const businessCurrencies = await this._businessCurrencyModelContext.findAll({
            where: { businessId },
            include: "currency",
        });
        return businessCurrencies.reduce((agg, businessCurrency) => {
            if (!businessCurrency.currency) return agg;
            return [...agg, (businessCurrency.currency as Currency).toJSON()];
        }, [] as CurrencyModelInterface[]);
    };

    addBusinessCurrencies: CurrencyRepoInterface["addBusinessCurrencies"] = async (
        businessId,
        currencyCodes,
        session
    ) => {
        const businessCurrencies = await this._businessCurrencyModelContext.bulkCreate(
            currencyCodes.map((code) => ({ businessId, currencyIsoCode: code })),
            { transaction: session as Transaction }
        );
        const addedCodes = businessCurrencies.map((curr) => curr.currencyIsoCode);
        const currencies = await this._currencyModelContext.findAll({
            where: { isoCode: addedCodes },
        });
        return currencies.map((currency) => currency.toJSON());
    };

    updateBusinessCurrencies: CurrencyRepoInterface["updateBusinessCurrencies"] = async (
        businessId,
        currencyCodes,
        session
    ) => {
        await this._businessCurrencyModelContext.destroy({
            where: { businessId },
            transaction: session as Transaction,
        });
        if (!currencyCodes.length) return [];
        const currencies = await this.addBusinessCurrencies(businessId, currencyCodes, session);
        return currencies;
    };
}
