import { BusinessService } from "../../../../logic/services";
import {
    BusinessServiceDependenciesInterface,
    BusinessRepoInterface,
} from "../../../../contracts/interfaces";
import {
    accountJson,
    businessData,
    businessJson,
    businessJsonArr,
    countryJson,
    standardBusiness,
    standardBusinessArr,
    standardBusinessWithCurrencies,
    standardCountry,
    standardCurrencyArr,
} from "../../../samples";
import { CountryNotSuportedError, BusinessNotFoundError } from "../../../../logic/errors";

const repo = {
    create: jest.fn(),
    findById: jest.fn(),
    getOwnerBusinesses: jest.fn(),
};

const dependencies = {
    repo,
    getCountry: jest.fn(),
    updateCurrencies: jest.fn(),
};

const businessService = new BusinessService(
    dependencies as unknown as BusinessServiceDependenciesInterface
);

describe("Testing business service", () => {
    describe("Testing createBusiness", () => {
        it("should check if country is supported", async () => {
            repo.create.mockResolvedValue(businessJson);
            dependencies.getCountry.mockResolvedValue(standardCountry);
            await businessService.createBusiness(businessData);
            expect(dependencies.getCountry).toHaveBeenCalledTimes(1);
            expect(dependencies.getCountry).toHaveBeenCalledWith(businessData.countryCode);
        });

        describe("Given a supported country", () => {
            it("should update the business currencies with the country's currencyCode", async () => {
                dependencies.updateCurrencies.mockResolvedValue(standardCurrencyArr);
                await businessService.createBusiness(businessData);
                expect(dependencies.updateCurrencies).toHaveBeenCalledTimes(1);
                expect(dependencies.updateCurrencies).toHaveBeenCalledWith(businessJson.id, [
                    countryJson.currencyCode,
                ]);
            });

            it("should return a standard business object", async () => {
                repo.create.mockResolvedValue(businessJson);
                const business = await businessService.createBusiness(businessData);
                expect(business).toEqual(standardBusinessWithCurrencies);
                expect(repo.create).toHaveBeenCalledTimes(1);
                expect(repo.create).toHaveBeenCalledWith(businessData);
            });
        });

        describe("Given an unsupported country", () => {
            it("should throw an error", async () => {
                dependencies.getCountry.mockResolvedValue(null);
                await expect(businessService.createBusiness(businessData)).rejects.toThrow(
                    new CountryNotSuportedError()
                );
            });
        });
    });

    describe("Testing getById", () => {
        describe("Given the business exists", () => {
            it("should return a standard business object", async () => {
                repo.findById.mockResolvedValue(businessJson);
                const result = await businessService.getById(businessJson.id);
                expect(result).toEqual(standardBusiness);
                expect(repo.findById).toHaveBeenCalledTimes(1);
                expect(repo.findById).toHaveBeenCalledWith(businessJson.id);
            });
        });

        describe("Given the business does not exist", () => {
            it("should throw an error", async () => {
                repo.findById.mockResolvedValue(null);
                expect(businessService.getById(businessJson.id)).rejects.toThrow(
                    new BusinessNotFoundError()
                );
                expect(repo.findById).toHaveBeenCalledTimes(1);
                expect(repo.findById).toHaveBeenCalledWith(businessJson.id);
            });
        });
    });

    describe("Testing getOwnerBusinesses", () => {
        describe("Given the owner has businesses", () => {
            it("should return a standard business object array", async () => {
                repo.getOwnerBusinesses.mockResolvedValue(businessJsonArr);
                const result = await businessService.getOwnerBusinesses(accountJson.id);
                expect(result).toEqual(standardBusinessArr);
                expect(repo.getOwnerBusinesses).toHaveBeenCalledTimes(1);
                expect(repo.getOwnerBusinesses).toHaveBeenCalledWith(accountJson.id);
            });
        });

        describe("Given the owner has no businesses", () => {
            it("should return an empty array", async () => {
                repo.getOwnerBusinesses.mockResolvedValue([]);
                const result = await businessService.getOwnerBusinesses(accountJson.id);
                expect(result).toEqual([]);
                expect(repo.getOwnerBusinesses).toHaveBeenCalledTimes(1);
                expect(repo.getOwnerBusinesses).toHaveBeenCalledWith(accountJson.id);
            });
        });
    });
});
