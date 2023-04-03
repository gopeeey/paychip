import { CurrencyServiceDependencies, CurrencyServiceInterface } from "./interfaces";

export class CurrencyService implements CurrencyServiceInterface {
    private readonly _repo: CurrencyServiceDependencies["repo"];

    constructor(private readonly _dependencies: CurrencyServiceDependencies) {
        this._repo = this._dependencies.repo;
    }

    getActive: CurrencyServiceInterface["getActive"] = async () => {
        const currencies = await this._repo.getActive();
        return currencies;
    };

    checkIsSupported: CurrencyServiceInterface["checkIsSupported"] = async (currencyCode) => {
        const activeCurrencies = await this.getActive();
        const supported = Boolean(
            activeCurrencies.find((currency) => currency.isoCode === currencyCode)
        );
        return supported;
    };
}
