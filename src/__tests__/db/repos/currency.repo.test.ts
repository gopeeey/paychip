import { CurrencyRepo } from "../../../db/repos";
import { Currency, BusinessCurrency } from "../../../db/models";
import {
    businessCurrencyObjArr,
    businessCurrencyObjWithCurrency,
    businessCurrencyObjWithCurrencyArr,
    businessJson,
    currencyJson,
    currencyJsonArr,
    currencyObj,
    currencyObjArr,
} from "../../samples";

const currencyModelMock = {
    findAll: jest.fn(),
};
const businessCurrencyModelMock = {
    bulkCreate: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
};

const currencyRepo = new CurrencyRepo(
    currencyModelMock as unknown as typeof Currency,
    businessCurrencyModelMock as unknown as typeof BusinessCurrency
);

describe("TESTING CURRENCY REPO", () => {
    describe("Testing getAll", () => {
        it("should return an array of currencyJson objects", async () => {
            currencyModelMock.findAll.mockResolvedValue(currencyObjArr);
            const currencies = await currencyRepo.getAll();
            expect(currencies).toEqual(currencyJsonArr);
            expect(currencyModelMock.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe("Testing getBusinessCurrencies", () => {
        describe("Given the business has currency objects", () => {
            it("should return an array of currencyJson objects", async () => {
                businessCurrencyModelMock.findAll.mockResolvedValue(
                    businessCurrencyObjWithCurrencyArr
                );
                const currencies = await currencyRepo.getBusinessCurrencies(businessJson.id);
                expect(currencies).toEqual(currencyJsonArr);
                expect(businessCurrencyModelMock.findAll).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("Testing addBusinessCurrencies", () => {
        it("should return an array of currency objects", async () => {
            businessCurrencyModelMock.bulkCreate.mockResolvedValue(businessCurrencyObjArr);
            const currencies = await currencyRepo.addBusinessCurrencies(businessJson.id, [
                currencyJson.isoCode,
            ]);
            expect(currencies).toEqual(currencyJsonArr);
            expect(businessCurrencyModelMock.bulkCreate).toHaveBeenCalledTimes(1);
        });
    });

    describe("Testing updateBusinessCurrencies", () => {
        it("should delete all business currencies", async () => {
            businessCurrencyModelMock.destroy.mockResolvedValue(businessCurrencyObjArr.length);
            await currencyRepo.updateBusinessCurrencies(businessJson.id, [currencyJson.isoCode]);
            expect(businessCurrencyModelMock.destroy).toHaveBeenCalledTimes(1);
        });

        describe("Given an empty array of currencies", () => {
            it("should return an empty array", async () => {
                businessCurrencyModelMock.destroy.mockResolvedValue(businessCurrencyObjArr.length);
                const currencies = await currencyRepo.updateBusinessCurrencies(businessJson.id, []);
                expect(currencies).toEqual([]);
            });
        });

        describe("Given a non empty array of currencies", () => {
            it("should return an array of currency objects", async () => {
                businessCurrencyModelMock.destroy.mockResolvedValue(businessCurrencyObjArr.length);
                businessCurrencyModelMock.bulkCreate.mockResolvedValue(businessCurrencyObjArr);
                const currencies = await currencyRepo.updateBusinessCurrencies(businessJson.id, [
                    currencyJson.isoCode,
                ]);
                expect(currencies).toEqual(currencyJsonArr);
                expect(businessCurrencyModelMock.bulkCreate).toHaveBeenCalledTimes(1);
            });
        });
    });
});
