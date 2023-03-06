import { CurrencyService, CurrencyServiceDependencies } from "@logic/currency";
import { sessionMock } from "src/__tests__/mocks";
import { businessJson, currencyJson, currencyJsonArr } from "src/__tests__/samples";

const repo = {
    updateBusinessCurrencies: jest.fn(),
    getBusinessCurrencies: jest.fn(),
};

const dependencies = { repo };

const currencyService = new CurrencyService(dependencies as unknown as CurrencyServiceDependencies);

describe("TESTING CURRENCY SERVICE", () => {
    describe("Testing updateBusinessCurrencies", () => {
        it("should return an array of currencies", async () => {
            repo.updateBusinessCurrencies.mockResolvedValue(currencyJsonArr);
            const currencies = await currencyService.updateBusinessCurrencies(
                businessJson.id,
                currencyJsonArr.map((curr) => curr.isoCode),
                sessionMock
            );
            expect(repo.updateBusinessCurrencies).toHaveBeenCalledTimes(1);
            expect(repo.updateBusinessCurrencies).toHaveBeenCalledWith(
                businessJson.id,
                currencyJsonArr.map((curr) => curr.isoCode),
                sessionMock
            );
            expect(currencies).toEqual(currencyJsonArr);
        });
    });

    describe("Testing getBusinessCurrencies", () => {
        it("should return an array of business currencies", async () => {
            repo.getBusinessCurrencies.mockResolvedValue(currencyJsonArr);
            const currencies = await currencyService.getBusinessCurrencies(businessJson.id);
            expect(currencies).toEqual(currencyJsonArr);
            expect(repo.getBusinessCurrencies).toHaveBeenCalledTimes(1);
            expect(repo.getBusinessCurrencies).toHaveBeenCalledWith(businessJson.id);
        });
    });

    describe("Testing isSupportedBusinessCurrency", () => {
        describe("Given the business currency is supported", () => {
            it("should return true", async () => {
                repo.getBusinessCurrencies.mockResolvedValue(currencyJsonArr);
                const answer = await currencyService.isSupportedBusinessCurrency(
                    businessJson.id,
                    currencyJson.isoCode
                );
                expect(answer).toBe(true);
                expect(repo.getBusinessCurrencies).toHaveBeenCalledTimes(1);
                expect(repo.getBusinessCurrencies).toHaveBeenCalledWith(businessJson.id);
            });
        });

        describe("Given the business currency is not supported", () => {
            it("should return false", async () => {
                repo.getBusinessCurrencies.mockResolvedValue([{ ...currencyJson, isoCode: "pie" }]);
                const answer = await currencyService.isSupportedBusinessCurrency(
                    businessJson.id,
                    currencyJson.isoCode
                );
                expect(answer).toBe(false);
                expect(repo.getBusinessCurrencies).toHaveBeenCalledTimes(1);
                expect(repo.getBusinessCurrencies).toHaveBeenCalledWith(businessJson.id);
            });
        });
    });
});
