import { BusinessCreator, BusinessCreatorDependencies } from "@logic/business";
import { AccountNotFoundError } from "@logic/account";
import { CountryNotSuportedError } from "@logic/country";
import {
    accountJson,
    businessData,
    businessJson,
    countryJson,
    walletData,
    walletJson,
} from "../../samples";

const dependencies = {
    dto: businessData,
    repo: {
        create: jest.fn(),
    },
    getCountry: jest.fn(),
    createWallet: jest.fn(),
    getOwner: jest.fn(),
    updateCurrencies: jest.fn(),
};

const businessCreator = new BusinessCreator(dependencies as unknown as BusinessCreatorDependencies);

const runCreator = async () => businessCreator.create();

const mockSuccess = () => {
    dependencies.repo.create.mockResolvedValue(businessJson);
    dependencies.getCountry.mockResolvedValue(countryJson);
    dependencies.createWallet.mockResolvedValue(walletJson);
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
                expect(dependencies.repo.create).toHaveBeenCalledWith(businessData);
            });

            // create wallet for business
            it("should create a wallet for the business", async () => {
                await runCreator();
                expect(dependencies.createWallet).toHaveBeenCalledTimes(1);
                expect(dependencies.createWallet).toHaveBeenCalledWith({
                    ...walletData,
                    currency: countryJson.currencyCode,
                });
            });

            // add currency of the country to the business currencies
            it("should update the business currencies", async () => {
                mockSuccess();
                await runCreator();
                expect(dependencies.updateCurrencies).toHaveBeenCalledTimes(1);
                expect(dependencies.updateCurrencies).toHaveBeenCalledWith(businessJson.id, [
                    countryJson.currencyCode,
                ]);
            });
        });
    });
});
