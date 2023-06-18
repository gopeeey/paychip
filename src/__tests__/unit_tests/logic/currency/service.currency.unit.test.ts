import {
    CurrencyModelInterface,
    CurrencyNotFoundError,
    CurrencyNotSupportedError,
    CurrencyService,
} from "@currency/logic";
import { CurrencyRepo } from "@currency/data";
import { createSpies } from "src/__tests__/mocks";
import { currencyJson } from "src/__tests__/samples";
import { Pool } from "pg";

const repo = new CurrencyRepo({} as Pool);

const repoSpies = createSpies(repo);

const currencyService = new CurrencyService({ repo });

describe("TESTING CURRENCY SERVICE", () => {
    describe(">>> getActive", () => {
        it("should return an array of active currency objects", async () => {
            repoSpies.getActive.mockResolvedValue([currencyJson]);
            const currencies = await currencyService.getActive();
            currencies.forEach((currency) => {
                expect(currency.active).toBe(true);
            });
            expect(repoSpies.getActive).toHaveBeenCalledTimes(1);
        });
    });

    describe(">>> validateIsSupported", () => {
        describe("given the currency is an active currency", () => {
            it("should run without throwing an error", async () => {
                const dataSet: CurrencyModelInterface[] = [
                    { ...currencyJson, isoCode: "USD", active: true },
                    { ...currencyJson, isoCode: "NGN", active: true },
                    { ...currencyJson, isoCode: "GBP", active: true },
                ];

                repoSpies.getActive.mockResolvedValue(dataSet);

                for (const data of dataSet) {
                    await currencyService.validateIsSupported(data.isoCode);
                }
                expect(repoSpies.getActive).toHaveBeenCalledTimes(dataSet.length);
            });
        });

        describe("given the currency is not an active currency", () => {
            it("should throw a CurrencyNotSupportedError", async () => {
                const resolved: CurrencyModelInterface[] = [
                    { ...currencyJson, isoCode: "USD", active: true },
                    { ...currencyJson, isoCode: "NGN", active: true },
                    { ...currencyJson, isoCode: "GBP", active: true },
                ];

                repoSpies.getActive.mockResolvedValue(resolved);

                const dataSet = ["ABC", "DEF", "GHI"];

                for (const code of dataSet) {
                    await expect(
                        (() => currencyService.validateIsSupported(code))()
                    ).rejects.toThrow(new CurrencyNotSupportedError(code));
                }
                expect(repoSpies.getActive).toHaveBeenCalledTimes(dataSet.length);
            });
        });
    });

    describe(">>> getCurrencyByIsoCode", () => {
        describe("given the currency exists", () => {
            it("should return a currency object", async () => {
                repoSpies.getByIsoCode.mockResolvedValue(currencyJson);
                const code = currencyJson.isoCode;
                const currency = await currencyService.getCurrencyByIsoCode(code);
                expect(currency).toEqual(currencyJson);
                expect(repoSpies.getByIsoCode).toHaveBeenCalledTimes(1);
                expect(repoSpies.getByIsoCode).toHaveBeenCalledWith(code);
            });
        });

        describe("given the currency does not exist", () => {
            it("should throw a CurrencyNotFoundError", async () => {
                repoSpies.getByIsoCode.mockResolvedValue(null);
                await expect(() =>
                    currencyService.getCurrencyByIsoCode("sokmething")
                ).rejects.toThrow(CurrencyNotFoundError);
            });
        });
    });
});
