import { ChargeScheme } from "../../../db/models";
import { ChargeSchemeRepo } from "../../../db/repos";
import { chargeSchemeObj, chargeSchemeJson, chargeSchemeData } from "../../samples";

const modelContext = {
    create: jest.fn(),
    findByPk: jest.fn(),
};

const chargeSchemeRepo = new ChargeSchemeRepo(modelContext as unknown as typeof ChargeScheme);

describe("TESTING CHARGE SCHEME REPO", () => {
    describe("Testing create", () => {
        it("should return a charge scheme object", async () => {
            modelContext.create.mockResolvedValue(chargeSchemeObj.customerCredit);
            const data = chargeSchemeData.customerCredit;
            const chargeScheme = await chargeSchemeRepo.create(data);
            expect(chargeScheme).toEqual(chargeSchemeJson.customerCredit);
            expect(modelContext.create).toHaveBeenCalledTimes(1);
            expect(modelContext.create).toHaveBeenCalledWith(data);
        });
    });

    describe("Testing getById", () => {
        describe("Given the chargeScheme exists", () => {
            it("should return a charge scheme json object", async () => {
                modelContext.findByPk.mockResolvedValue(chargeSchemeObj.customerCredit);
                const data = chargeSchemeObj.customerCredit.id;
                const chargeScheme = await chargeSchemeRepo.getById(data);
                expect(chargeScheme).toEqual(chargeSchemeJson.customerCredit);
                expect(modelContext.findByPk).toHaveBeenCalledTimes(1);
                expect(modelContext.findByPk).toHaveBeenCalledWith(data);
            });
        });

        describe("Given the chargeScheme does not exist", () => {
            it("should return null", async () => {
                modelContext.findByPk.mockResolvedValue(null);
                const data = chargeSchemeObj.customerCredit.id;
                const chargeScheme = await chargeSchemeRepo.getById(data);
                expect(chargeScheme).toBeNull();
                expect(modelContext.findByPk).toHaveBeenCalledTimes(1);
                expect(modelContext.findByPk).toHaveBeenCalledWith(data);
            });
        });
    });
});
