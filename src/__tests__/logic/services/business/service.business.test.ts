import { BusinessService } from "../../../../logic/services";
import {
    BusinessServiceDependenciesInterface,
    BusinessRepoInterface,
} from "../../../../contracts/interfaces";
import { businessData, businessJson, standardBusiness } from "../../../samples";
import { CountryNotSuportedError, BusinessNotFoundError } from "../../../../logic/errors";

const createMock = jest.fn();
const findByIdMock = jest.fn();
const repo = {
    create: createMock,
    findById: findByIdMock,
} as unknown as BusinessRepoInterface;

const checkCountrySupportedMock = jest.fn();
const dependencies = {
    repo,
    checkCountrySupported: checkCountrySupportedMock,
} as unknown as BusinessServiceDependenciesInterface;

const businessService = new BusinessService(dependencies);

describe("Testing business service", () => {
    describe("Testing createBusiness", () => {
        it("should check if country is supported", async () => {
            createMock.mockResolvedValue(businessJson);
            checkCountrySupportedMock.mockResolvedValue(true);
            await businessService.createBusiness(businessData);
            expect(checkCountrySupportedMock).toHaveBeenCalledTimes(1);
            expect(checkCountrySupportedMock).toHaveBeenCalledWith(businessData.countryCode);
        });

        describe("Given a supported country", () => {
            it("should return a standard business object", async () => {
                createMock.mockResolvedValue(businessJson);
                const business = await businessService.createBusiness(businessData);
                expect(business).toEqual(standardBusiness);
                expect(createMock).toHaveBeenCalledTimes(1);
                expect(createMock).toHaveBeenCalledWith(businessData);
            });
        });

        describe("Given an unsupported country", () => {
            it("should throw an error", async () => {
                checkCountrySupportedMock.mockResolvedValue(false);
                await expect(businessService.createBusiness(businessData)).rejects.toThrow(
                    new CountryNotSuportedError()
                );
            });
        });
    });

    describe("Testing getById", () => {
        describe("Given the business exists", () => {
            it("should return a standard business object", async () => {
                findByIdMock.mockResolvedValue(businessJson);
                const result = await businessService.getById(businessJson.id);
                expect(result).toEqual(standardBusiness);
                expect(findByIdMock).toHaveBeenCalledTimes(1);
                expect(findByIdMock).toHaveBeenCalledWith(businessJson.id);
            });
        });

        describe("Given the business does not exist", () => {
            it("should throw an error", async () => {
                findByIdMock.mockResolvedValue(null);
                expect(businessService.getById(businessJson.id)).rejects.toThrow(
                    new BusinessNotFoundError()
                );
                expect(findByIdMock).toHaveBeenCalledTimes(1);
                expect(findByIdMock).toHaveBeenCalledWith(businessJson.id);
            });
        });
    });
});
