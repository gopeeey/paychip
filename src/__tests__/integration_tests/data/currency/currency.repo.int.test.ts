import { Business } from "@data/business";
import { CurrencyRepo, Currency, BusinessCurrency } from "@data/currency";
import { StartSequelizeSession } from "@data/sequelize_session";
import { currencySeeder } from "src/__tests__/samples";
import { DBSetup } from "src/__tests__/test_utils";

const currencyRepo = new CurrencyRepo(Currency, BusinessCurrency);

DBSetup(currencySeeder);

describe("TESTING CURRENCY REPO", () => {
    describe("Testing getAll", () => {
        it("should return an array of currencyJson objects", async () => {
            const expected = await Currency.findAll();
            const currencies = await currencyRepo.getAll();
            expect(currencies).toEqual(expected.map((ex) => ex.toJSON()));
        });
    });

    // describe("Testing getBusinessCurrencies", () => {
    //     describe("Given the business has currency objects", () => {
    //         it("should return an array of currencyJson objects", async () => {
    //             const business = await Business.findOne();
    //             if (!business) throw new Error("Seeding error: business not found");
    //             const bCurrencies = await BusinessCurrency.findAll({
    //                 where: { businessId: business.id },
    //             });
    //             const expectedCodes = bCurrencies.map((curr) => curr.currencyIsoCode);
    //             const currencies = await currencyRepo.getBusinessCurrencies(business.id);

    //             const first = await Currency.findOne();
    //             if (!first) throw new Error("Seeding error");
    //             const expectedKeysLength = Object.keys(first.toJSON()).length;
    //             currencies.forEach((currency) => {
    //                 expect(expectedCodes).toContain(currency.isoCode);
    //                 expect(Object.keys(currency).length).toBe(expectedKeysLength);
    //             });
    //         });
    //     });
    // });

    // describe("Testing addBusinessCurrencies", () => {
    //     it("should return an array of currency objects", async () => {
    //         const session = await StartSequelizeSession();
    //         const bulkCreateMock = jest.spyOn(BusinessCurrency, "bulkCreate");
    //         const business = await Business.findOne();
    //         if (!business) throw new Error("Seeding error: business not found");
    //         await currencyRepo.addBusinessCurrencies(business.id, ["USD"], session);
    //         await session.commit();
    //         const bCurrencies = await currencyRepo.getBusinessCurrencies(business.id);
    //         const newlyAdded = bCurrencies.find((bCurr) => bCurr.isoCode === "USD");
    //         expect(newlyAdded).toBeDefined();
    //         expect(bulkCreateMock).toHaveBeenCalledTimes(1);
    //         expect(bulkCreateMock).toHaveBeenCalledWith(
    //             [
    //                 {
    //                     businessId: business.id,
    //                     currencyIsoCode: "USD",
    //                 },
    //             ],
    //             { transaction: session }
    //         );
    //     });
    // });

    // describe("Testing updateBusinessCurrencies", () => {
    //     it("should delete all business currencies", async () => {
    //         const session = await StartSequelizeSession();
    //         const destroyMock = jest.spyOn(BusinessCurrency, "destroy");
    //         const business = await Business.findOne();
    //         if (!business) throw new Error("Seeding error: business not found");

    //         const newCurrencyCodes = ["USD"];
    //         await currencyRepo.updateBusinessCurrencies(business.id, newCurrencyCodes, session);
    //         await session.commit();
    //         const bCurrencies = await currencyRepo.getBusinessCurrencies(business.id);
    //         const expectedCurrencyCodes = bCurrencies.map((bCurr) => bCurr.isoCode);

    //         expect(expectedCurrencyCodes).toEqual(newCurrencyCodes);
    //         expect(destroyMock).toHaveBeenCalledTimes(1);
    //         expect(destroyMock).toHaveBeenCalledWith({
    //             where: { businessId: business.id },
    //             transaction: session,
    //         });
    //     });

    //     describe("Given a non empty array of currencies", () => {
    //         it("should return an array of currency objects", async () => {
    //             const addSpy = jest.spyOn(currencyRepo, "addBusinessCurrencies");
    //             const session = await StartSequelizeSession();
    //             const business = await Business.findOne();
    //             if (!business) throw new Error("Seeding error: business not found");

    //             const newCurrencyCodes = ["USD"];
    //             const updatedCurrencies = await currencyRepo.updateBusinessCurrencies(
    //                 business.id,
    //                 newCurrencyCodes,
    //                 session
    //             );
    //             await session.commit();
    //             const bCurrencies = await currencyRepo.getBusinessCurrencies(business.id);

    //             expect(updatedCurrencies).toEqual(bCurrencies);
    //             expect(addSpy).toHaveBeenCalledTimes(1);
    //             expect(addSpy).toHaveBeenCalledWith(business.id, newCurrencyCodes, session);
    //         });
    //     });
    // });
});
