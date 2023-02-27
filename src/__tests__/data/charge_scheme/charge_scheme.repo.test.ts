import { ChargeScheme, ChargeSchemeRepo } from "@data/charge_scheme";
import { generateIdMock } from "src/__tests__/mocks";
import { chargeSchemeObj, chargeSchemeJson, chargeSchemeData } from "../../samples";

const modelContext = {
    create: jest.fn(),
    findByPk: jest.fn(),
};

const chargeSchemeRepo = new ChargeSchemeRepo(modelContext as unknown as typeof ChargeScheme);

describe("TESTING CHARGE SCHEME REPO", () => {
    describe("Testing create", () => {
        it("should return a charge scheme object", async () => {
            modelContext.create.mockResolvedValue(chargeSchemeObj.customerFunding);
            generateIdMock.mockReturnValue(chargeSchemeObj.customerFunding.id);
            const data = chargeSchemeData.customerFunding;
            const chargeScheme = await chargeSchemeRepo.create(data);
            expect(chargeScheme).toEqual(chargeSchemeJson.customerFunding);
            expect(modelContext.create).toHaveBeenCalledTimes(1);
            expect(modelContext.create).toHaveBeenCalledWith({
                ...data,
                id: chargeSchemeObj.customerFunding.id,
            });
            expect(generateIdMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("Testing getById", () => {
        describe("Given the chargeScheme exists", () => {
            it("should return a charge scheme json object", async () => {
                modelContext.findByPk.mockResolvedValue(chargeSchemeObj.customerFunding);
                const data = chargeSchemeObj.customerFunding.id;
                const chargeScheme = await chargeSchemeRepo.getById(data);
                expect(chargeScheme).toEqual(chargeSchemeJson.customerFunding);
                expect(modelContext.findByPk).toHaveBeenCalledTimes(1);
                expect(modelContext.findByPk).toHaveBeenCalledWith(data);
            });
        });

        describe("Given the chargeScheme does not exist", () => {
            it("should return null", async () => {
                modelContext.findByPk.mockResolvedValue(null);
                const data = chargeSchemeObj.customerFunding.id;
                const chargeScheme = await chargeSchemeRepo.getById(data);
                expect(chargeScheme).toBeNull();
                expect(modelContext.findByPk).toHaveBeenCalledTimes(1);
                expect(modelContext.findByPk).toHaveBeenCalledWith(data);
            });
        });
    });
});
