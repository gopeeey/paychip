import {
    BusinessModelInterface,
    CurrencyModelInterface,
    CurrencyServiceDependencies,
    CurrencyServiceInterface,
} from "../../../contracts/interfaces";

export class CurrencyService implements CurrencyServiceInterface {
    private readonly _repo: CurrencyServiceDependencies["repo"];

    constructor(private readonly _dependencies: CurrencyServiceDependencies) {
        this._repo = this._dependencies.repo;
    }

    updateBusinessCurrencies = async (
        businessId: BusinessModelInterface["id"],
        currencyCodes: CurrencyModelInterface["isoCode"][]
    ) => {
        const currencies = await this._repo.updateBusinessCurrencies(businessId, currencyCodes);
        return currencies;
    };

    getBusinessCurrencies: CurrencyServiceInterface["getBusinessCurrencies"] = async (
        businessId
    ) => {
        const currencies = await this._repo.getBusinessCurrencies(businessId);
        return currencies;
    };

    isSupportedBusinessCurrency: CurrencyServiceInterface["isSupportedBusinessCurrency"] = async (
        businessId,
        currencyCode
    ) => {
        const businessCurrencies = await this.getBusinessCurrencies(businessId);
        const supported = businessCurrencies.find((currency) => currency.isoCode === currencyCode);
        return Boolean(supported);
    };
}
