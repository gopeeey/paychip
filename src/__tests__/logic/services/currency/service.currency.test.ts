import {
    CurrencyRepoInterface,
    CurrencyServiceDependencies,
} from "../../../../contracts/interfaces";
import { CurrencyService } from "../../../../logic/services";
import { businessJson, currencyJsonArr } from "../../../samples";

const repo = {
    updateBusinessCurrencies: jest.fn(),
};

const dependencies = { repo };

const currencyService = new CurrencyService(dependencies as unknown as CurrencyServiceDependencies);

describe("TESTING CURRENCY SERVICE", () => {
    describe("Testing updateBusinessCurrencies", () => {
        it("should return an array of currencies", async () => {
            repo.updateBusinessCurrencies.mockResolvedValue(currencyJsonArr);
            const currencies = await currencyService.updateBusinessCurrencies(
                businessJson.id,
                currencyJsonArr.map((curr) => curr.isoCode)
            );
            expect(repo.updateBusinessCurrencies).toHaveBeenCalledTimes(1);
            expect(repo.updateBusinessCurrencies).toHaveBeenCalledWith(
                businessJson.id,
                currencyJsonArr.map((curr) => curr.isoCode)
            );
            expect(currencies).toEqual(currencyJsonArr);
        });
    });
});
