import { BusinessCreator, BusinessCreatorDependencies } from "@logic/business";
import { AccountNotFoundError } from "@accounts/logic";
import { CountryNotSuportedError } from "@logic/country";
import {
    accountJson,
    businessData,
    businessJson,
    bwData,
    bwJson,
    countryJson,
    walletData,
    walletJson,
} from "src/__tests__/samples";
import { sessionMock } from "src/__tests__/mocks";

const dependencies = {
    dto: businessData,
    repo: { create: jest.fn() },
    session: sessionMock,
    getCountry: jest.fn(),
    createBusinessWallet: jest.fn(),
    getOwner: jest.fn(),
};

const businessCreator = new BusinessCreator(dependencies as unknown as BusinessCreatorDependencies);

const runCreator = async () => businessCreator.create();

const mockSuccess = () => {
    dependencies.repo.create.mockResolvedValue(businessJson);
    dependencies.getCountry.mockResolvedValue(countryJson);
    dependencies.createBusinessWallet.mockResolvedValue(bwJson);
    dependencies.getOwner.mockResolvedValue(accountJson);
};

describe("TESTING BUSINESS CREATOR", () => {
    it("should check if the owner exists", async () => {
        mockSuccess();
        dependencies.getOwner.mockResolvedValue(accountJson);
        await runCreator();
        expect(dependencies.getOwner).toHaveBeenCalledTimes(1);
        expect(dependencies.getOwner).toHaveBeenCalledWith(businessData.ownerId);
    });

    describe("Given the owner does not exist", () => {
        it("should throw an account not found error", async () => {
            dependencies.getOwner.mockRejectedValue(new AccountNotFoundError());
            await expect(runCreator()).rejects.toThrow(new AccountNotFoundError());
        });
    });

    describe("Given the owner exists", () => {
        it("should proceed", () => {
            dependencies.getOwner.mockResolvedValue(accountJson);
        });

        it("should check if the provided country is supported", async () => {
            mockSuccess();
            dependencies.getCountry.mockResolvedValue(countryJson);
            await runCreator();
            expect(dependencies.getCountry).toHaveBeenCalledTimes(1);
            expect(dependencies.getCountry).toHaveBeenCalledWith(businessData.countryCode);
        });

        describe("Given the country does not exist", () => {
            it("should throw a country not supported error", async () => {
                dependencies.getCountry.mockRejectedValue(new CountryNotSuportedError());
                await expect(runCreator()).rejects.toThrow(new CountryNotSuportedError());
            });
        });

        describe("Given the country exists", () => {
            it("should proceed", () => {
                dependencies.getCountry.mockResolvedValue(countryJson);
            });

            // persist business
            it("should persist the business", async () => {
                dependencies.repo.create.mockResolvedValue(businessJson);

                await runCreator();
                expect(dependencies.repo.create).toHaveBeenCalledTimes(1);
                expect(dependencies.repo.create).toHaveBeenCalledWith(businessData, sessionMock);
            });

            // create wallet for business
            it("should create a wallet for the business", async () => {
                await runCreator();
                expect(dependencies.createBusinessWallet).toHaveBeenCalledTimes(1);
                expect(dependencies.createBusinessWallet).toHaveBeenCalledWith(
                    {
                        ...bwData,
                        currencyCode: countryJson.currencyCode,
                    },
                    sessionMock
                );
            });
        });
    });
});
