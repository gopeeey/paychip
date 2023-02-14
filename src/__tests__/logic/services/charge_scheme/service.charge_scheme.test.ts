import { ChargeSchemeService } from "../../../../logic/services";
import { ChargeSchemeServiceDependencies } from "../../../../contracts/interfaces";
import { chargeSchemeData, chargeSchemeJson, chargeSchemeObj } from "../../../samples";
import { ChargeSchemeNotFoundError } from "../../../../logic/errors";

const dependencies = {
    repo: {
        create: jest.fn(),
        getById: jest.fn(),
    },
};

const chargeSchemeService = new ChargeSchemeService(
    dependencies as unknown as ChargeSchemeServiceDependencies
);

describe("TESTING CHARGE SCHEME SERVICE", () => {
    describe("Testing create", () => {
        it("should return a standard charge scheme object", async () => {
            dependencies.repo.create.mockResolvedValue(chargeSchemeJson.customerCredit);
            const data = chargeSchemeData.customerCredit;
            const chargeScheme = await chargeSchemeService.create(data);
            expect(chargeScheme).toEqual(chargeSchemeJson.customerCredit);
            expect(dependencies.repo.create).toHaveBeenCalledTimes(1);
            expect(dependencies.repo.create).toHaveBeenCalledWith(data);
        });
    });

    describe("Testing getById", () => {
        describe("Given the charge scheme exists", () => {
            it("should return a standard charge scheme object", async () => {
                dependencies.repo.getById.mockResolvedValue(chargeSchemeJson.customerCredit);
                const data = chargeSchemeObj.customerCredit.id;
                const chargeScheme = await chargeSchemeService.getById(data);
                expect(chargeScheme).toEqual(chargeSchemeJson.customerCredit);
                expect(dependencies.repo.getById).toHaveBeenCalledTimes(1);
                expect(dependencies.repo.getById).toHaveBeenCalledWith(data);
            });
        });

        describe("Given the charge scheme does not exist", () => {
            it("should throw a charge scheme not found error", async () => {
                dependencies.repo.getById.mockResolvedValue(null);
                const data = chargeSchemeObj.customerCredit.id;
                await expect(chargeSchemeService.getById(data)).rejects.toThrow(
                    new ChargeSchemeNotFoundError()
                );
                expect(dependencies.repo.getById).toHaveBeenCalledTimes(1);
                expect(dependencies.repo.getById).toHaveBeenCalledWith(data);
            });
        });
    });
});
