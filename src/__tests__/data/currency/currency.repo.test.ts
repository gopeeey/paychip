import { CurrencyRepo, Currency, BusinessCurrency } from "@data/currency";
import { sessionMock } from "src/__tests__/mocks";
import {
    businessCurrencyObjArr,
    businessCurrencyObjWithCurrencyArr,
    businessJson,
    currencyJson,
    currencyJsonArr,
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

const addBusinessCurrenciesMock = jest.spyOn(currencyRepo, "addBusinessCurrencies");

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
            const currencies = await currencyRepo.addBusinessCurrencies(
                businessJson.id,
                [currencyJson.isoCode],
                sessionMock
            );
            expect(currencies).toEqual(currencyJsonArr);
            expect(businessCurrencyModelMock.bulkCreate).toHaveBeenCalledTimes(1);
            expect(businessCurrencyModelMock.bulkCreate).toHaveBeenCalledWith(
                [
                    {
                        businessId: businessJson.id,
                        currencyIsoCode: currencyJson.isoCode,
                    },
                ],
                { transaction: sessionMock }
            );
        });
    });

    describe("Testing updateBusinessCurrencies", () => {
        it("should delete all business currencies", async () => {
            businessCurrencyModelMock.destroy.mockResolvedValue(businessCurrencyObjArr.length);
            addBusinessCurrenciesMock.mockResolvedValue(currencyJsonArr);
            await currencyRepo.updateBusinessCurrencies(
                businessJson.id,
                [currencyJson.isoCode],
                sessionMock
            );
            expect(businessCurrencyModelMock.destroy).toHaveBeenCalledTimes(1);
            expect(businessCurrencyModelMock.destroy).toHaveBeenCalledWith({
                where: { businessId: businessJson.id },
                transaction: sessionMock,
            });
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
                const currencies = await currencyRepo.updateBusinessCurrencies(
                    businessJson.id,
                    [currencyJson.isoCode],
                    sessionMock
                );
                expect(currencies).toEqual(currencyJsonArr);
                expect(addBusinessCurrenciesMock).toHaveBeenCalledTimes(1);
                expect(addBusinessCurrenciesMock).toHaveBeenCalledWith(
                    businessJson.id,
                    [currencyJson.isoCode],
                    sessionMock
                );
            });
        });
    });
});
