import { CurrencyRepoInterface } from "@logic/currency";
import { Currency } from "./currency.model";

export class CurrencyRepo implements CurrencyRepoInterface {
    getAll: CurrencyRepoInterface["getAll"] = async () => {
        const currencies = await Currency.findAll({});
        return currencies.map((currency) => currency.toJSON());
    };

    getActive: CurrencyRepoInterface["getActive"] = async () => {
        const currencies = await Currency.findAll({ where: { active: true } });
        return currencies.map((curr) => curr.toJSON());
    };
}
