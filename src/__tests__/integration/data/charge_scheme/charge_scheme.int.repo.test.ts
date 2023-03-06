import { ChargeScheme, ChargeSchemeRepo } from "@data/charge_scheme";
import { generateIdMock } from "src/__tests__/mocks";
import { chargeSchemeObj, chargeSchemeJson, chargeSchemeData } from "src/__tests__/samples";

const modelContext = {
    create: jest.fn(),
    findByPk: jest.fn(),
};

const chargeSchemeRepo = new ChargeSchemeRepo(modelContext as unknown as typeof ChargeScheme);

describe("TESTING CHARGE SCHEME REPO", () => {
    describe("Testing create", () => {
        it("should return a charge scheme object", async () => {
            modelContext.create.mockResolvedValue(chargeSchemeObj.senderFunding);
            generateIdMock.mockReturnValue(chargeSchemeObj.senderFunding.id);
            const data = chargeSchemeData.senderFunding;
            const chargeScheme = await chargeSchemeRepo.create(data);
            expect(chargeScheme).toEqual(chargeSchemeJson.senderFunding);
            expect(modelContext.create).toHaveBeenCalledTimes(1);
            expect(modelContext.create).toHaveBeenCalledWith({
                ...data,
                id: chargeSchemeObj.senderFunding.id,
            });
            expect(generateIdMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("Testing getById", () => {
        describe("Given the chargeScheme exists", () => {
            it("should return a charge scheme json object", async () => {
                modelContext.findByPk.mockResolvedValue(chargeSchemeObj.senderFunding);
                const data = chargeSchemeObj.senderFunding.id;
                const chargeScheme = await chargeSchemeRepo.getById(data);
                expect(chargeScheme).toEqual(chargeSchemeJson.senderFunding);
                expect(modelContext.findByPk).toHaveBeenCalledTimes(1);
                expect(modelContext.findByPk).toHaveBeenCalledWith(data);
            });
        });

        describe("Given the chargeScheme does not exist", () => {
            it("should return null", async () => {
                modelContext.findByPk.mockResolvedValue(null);
                const data = chargeSchemeObj.senderFunding.id;
                const chargeScheme = await chargeSchemeRepo.getById(data);
                expect(chargeScheme).toBeNull();
                expect(modelContext.findByPk).toHaveBeenCalledTimes(1);
                expect(modelContext.findByPk).toHaveBeenCalledWith(data);
            });
        });
    });
});
