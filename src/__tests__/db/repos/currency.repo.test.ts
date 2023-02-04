import { CurrencyRepo } from "../../../db/repos";
import { Currency, BusinessCurrency } from "../../../db/models";
import {
    businessCurrencyObjArr,
    businessCurrencyObjWithCurrency,
    businessCurrencyObjWithCurrencyArr,
    businessJson,
    currencyJsonArr,
    currencyObj,
    currencyObjArr,
} from "../../samples";

const currencyModelMock = {
    findAll: jest.fn(),
};
const businessCurrencyModelMock = {
    findAll: jest.fn(),
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
});