import { BusinessService } from "../../../logic/services";
import { BusinessDetailsInterface, BusinessRepoInterface } from "../../../contracts/interfaces";
import { businessData, businessJson, standardBusiness } from "../../samples";

const createMock = jest.fn();

const repo = {
    create: createMock,
} as unknown as BusinessRepoInterface;

const checkCountrySupportedMock = jest.fn();
const details = {
    checkCountrySupported: checkCountrySupportedMock,
} as unknown as BusinessDetailsInterface;

const businessService = new BusinessService(repo, details);

describe("Testing business service", () => {
    describe("Testing createBusiness", () => {
        it("should check if country is supported", async () => {
            createMock.mockResolvedValue(businessJson);
            await businessService.createBusiness(businessData);
            throw new Error("Implement check for if country service is called");
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
                throw new Error("You haven't implemented check supported country yet");
            });
        });
    });
});
