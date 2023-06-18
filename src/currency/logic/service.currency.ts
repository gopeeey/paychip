import { CurrencyNotFoundError, CurrencyNotSupportedError } from "./errors";
import {
    CurrencyModelInterface,
    CurrencyServiceDependencies,
    CurrencyServiceInterface,
} from "./interfaces";

export class CurrencyService implements CurrencyServiceInterface {
    private readonly _repo: CurrencyServiceDependencies["repo"];

    constructor(private readonly _dependencies: CurrencyServiceDependencies) {
        this._repo = this._dependencies.repo;
    }

    getActive: CurrencyServiceInterface["getActive"] = async () => {
        const currencies = await this._repo.getActive();
        return currencies;
    };

    validateIsSupported: CurrencyServiceInterface["validateIsSupported"] = async (currencyCode) => {
        const activeCurrencies = await this.getActive();
        const supported = Boolean(
            activeCurrencies.find((currency) => currency.isoCode === currencyCode)
        );
        if (!supported) throw new CurrencyNotSupportedError(currencyCode);
    };

    getCurrencyByIsoCode: CurrencyServiceInterface["getCurrencyByIsoCode"] = async (isoCode) => {
        const currency = await this._repo.getByIsoCode(isoCode);
        if (!currency) throw new CurrencyNotFoundError();
        return currency;
    };
}
