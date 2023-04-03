import {
    CurrencyModelInterface,
    CurrencyService,
    CurrencyServiceDependencies,
} from "@logic/currency";
import { CurrencyRepo } from "@data/currency";
import { createSpies } from "src/__tests__/mocks";
import { currencyJson, currencyObj } from "src/__tests__/samples";
const repoMock = createSpies(new CurrencyRepo());

const dependencies = { repo: repoMock };

const currencyService = new CurrencyService(dependencies as unknown as CurrencyServiceDependencies);

describe("TESTING CURRENCY SERVICE", () => {
    describe("Testing getActive", () => {
        it("should return an array of active currency objects", async () => {
            repoMock.getActive.mockResolvedValue([currencyJson]);
            const currencies = await currencyService.getActive();
            currencies.forEach((currency) => {
                expect(currency.active).toBe(true);
            });
            expect(repoMock.getActive).toHaveBeenCalledTimes(1);
        });
    });

    describe("Testing checkIsActive", () => {
        describe("given the currency is an active currency", () => {
            it("should return true", async () => {
                const dataSet: CurrencyModelInterface[] = [
                    { ...currencyJson, isoCode: "USD", active: true },
                    { ...currencyJson, isoCode: "NGN", active: true },
                    { ...currencyJson, isoCode: "GBP", active: true },
                ];

                const nonExisting: CurrencyModelInterface[] = [
                    { ...currencyJson, isoCode: "ABC", active: true },
                    { ...currencyJson, isoCode: "NAN", active: false },
                    { ...currencyJson, isoCode: "GBB", active: true },
                ];

                repoMock.getActive.mockResolvedValue(dataSet);

                for (const data of dataSet) {
                    const val = await currencyService.checkIsSupported(data.isoCode);
                    expect(val).toBe(true);
                }
                expect(repoMock.getActive).toHaveBeenCalledTimes(dataSet.length);
            });
        });

        describe("given the currency is not an active currency", () => {
            it("should return false", async () => {
                const resolved: CurrencyModelInterface[] = [
                    { ...currencyJson, isoCode: "USD", active: true },
                    { ...currencyJson, isoCode: "NGN", active: true },
                    { ...currencyJson, isoCode: "GBP", active: true },
                ];

                repoMock.getActive.mockResolvedValue(resolved);

                const dataSet = ["ABC", "DEF", "GHI"];

                for (const code of dataSet) {
                    const val = await currencyService.checkIsSupported(code);
                    expect(val).toBe(false);
                }
                expect(repoMock.getActive).toHaveBeenCalledTimes(dataSet.length);
            });
        });
    });
});
