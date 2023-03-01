import {
    ChargeSchemeService,
    ChargeSchemeServiceDependencies,
    ChargeSchemeNotFoundError,
} from "@logic/charge_scheme";

import { chargeSchemeData, chargeSchemeJson, chargeSchemeObj } from "../../samples";

const dependencies = {
    repo: {
        create: jest.fn(),
        getById: jest.fn(),
    },
};

const chargeSchemeService = new ChargeSchemeService(
    dependencies as unknown as ChargeSchemeServiceDependencies
);

const getByIdMock = jest.spyOn(chargeSchemeService, "getById");

describe("TESTING CHARGE SCHEME SERVICE", () => {
    describe("Testing create", () => {
        it("should return a standard charge scheme object", async () => {
            dependencies.repo.create.mockResolvedValue(chargeSchemeJson.customerFunding);
            const data = chargeSchemeData.customerFunding;
            const chargeScheme = await chargeSchemeService.create(data);
            expect(chargeScheme).toEqual(chargeSchemeJson.customerFunding);
            expect(dependencies.repo.create).toHaveBeenCalledTimes(1);
            expect(dependencies.repo.create).toHaveBeenCalledWith(data);
        });
    });

    describe("Testing getById", () => {
        describe("Given the charge scheme exists", () => {
            it("should return a standard charge scheme object", async () => {
                dependencies.repo.getById.mockResolvedValue(chargeSchemeJson.customerFunding);
                const data = chargeSchemeObj.customerFunding.id;
                const chargeScheme = await chargeSchemeService.getById(data);
                expect(chargeScheme).toEqual(chargeSchemeJson.customerFunding);
                expect(dependencies.repo.getById).toHaveBeenCalledTimes(1);
                expect(dependencies.repo.getById).toHaveBeenCalledWith(data);
            });
        });

        describe("Given the charge scheme does not exist", () => {
            it("should throw a charge scheme not found error", async () => {
                dependencies.repo.getById.mockResolvedValue(null);
                const data = chargeSchemeObj.customerFunding.id;
                await expect(chargeSchemeService.getById(data)).rejects.toThrow(
                    new ChargeSchemeNotFoundError()
                );
                expect(dependencies.repo.getById).toHaveBeenCalledTimes(1);
                expect(dependencies.repo.getById).toHaveBeenCalledWith(data);
            });
        });
    });

    describe("Testing getCompatibility", () => {
        describe("Given the currency matches the charge scheme currency", () => {
            it("should return true", async () => {
                getByIdMock.mockResolvedValue({
                    ...chargeSchemeJson.customerFunding,
                    currency: "NGN",
                });
                const val = await chargeSchemeService.checkCompatibility(
                    chargeSchemeJson.customerFunding.id,
                    "NGN"
                );
                expect(val).toBe(true);
                expect(getByIdMock).toHaveBeenCalledTimes(1);
                expect(getByIdMock).toHaveBeenCalledWith(chargeSchemeJson.customerFunding.id);
            });
        });

        describe("given the currency does not match the charge scheme currency", () => {
            it("should return false", async () => {
                const val = await chargeSchemeService.checkCompatibility(
                    chargeSchemeJson.customerFunding.id,
                    "USD"
                );
                expect(val).toBe(false);
                expect(getByIdMock).toHaveBeenCalledTimes(1);
                expect(getByIdMock).toHaveBeenCalledWith(chargeSchemeJson.customerFunding.id);
            });
        });
    });
});
