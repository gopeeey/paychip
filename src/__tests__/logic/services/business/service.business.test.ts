import { BusinessService } from "../../../../logic/services";
import { BusinessServiceDependenciesInterface } from "../../../../contracts/interfaces";
import { accountJson, businessData, businessJson, businessJsonArr } from "../../../samples";
import { BusinessNotFoundError } from "../../../../logic/errors";
import { BusinessCreator } from "../../../../logic/services";

const businessCreatorSpy = jest.spyOn(BusinessCreator.prototype, "create");

const repo = {
    create: jest.fn(),
    findById: jest.fn(),
    getOwnerBusinesses: jest.fn(),
};

const dependencies = {
    repo,
    getCountry: jest.fn(),
    updateCurrencies: jest.fn(),
    getAccount: jest.fn(),
    createWallet: jest.fn(),
};

const businessService = new BusinessService(
    dependencies as unknown as BusinessServiceDependenciesInterface
);

describe("Testing business service", () => {
    describe("Testing createBusiness", () => {
        it("should return a business object", async () => {
            businessCreatorSpy.mockResolvedValue(businessJson);
            const business = await businessService.createBusiness(businessData);
            expect(business).toEqual(businessJson);
            expect(businessCreatorSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("Testing getById", () => {
        describe("Given the business exists", () => {
            it("should return a business object", async () => {
                repo.findById.mockResolvedValue(businessJson);
                const result = await businessService.getById(businessJson.id);
                expect(result).toEqual(businessJson);
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
            it("should return a business object array", async () => {
                repo.getOwnerBusinesses.mockResolvedValue(businessJsonArr);
                const result = await businessService.getOwnerBusinesses(accountJson.id);
                expect(result).toEqual(businessJsonArr);
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
