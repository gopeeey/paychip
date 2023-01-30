import { BusinessRepo } from "../../../db/repos";
import { Business } from "../../../db/models";
import { businessData, businessJson, businessObj } from "../../samples";

const createMock = jest.fn();
const findAllMock = jest.fn();
const findByPkMock = jest.fn();
const modelContext = {
    create: createMock,
    findAll: findAllMock,
    findByPk: findByPkMock,
} as unknown as typeof Business;

const businessRepo = new BusinessRepo(modelContext);

describe("Testing business repo", () => {
    describe("Testing create", () => {
        it("should return business object", async () => {
            createMock.mockResolvedValue(businessObj);
            const business = await businessRepo.create(businessData);
            expect(business).toEqual(businessJson);
            expect(createMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("Testing findById method", () => {
        describe("Given the business exists", () => {
            it("should call the correct method on the model", async () => {
                findByPkMock.mockResolvedValue(businessObj);
                await businessRepo.findById(businessJson.id);
                expect(findByPkMock).toHaveBeenCalledTimes(1);
                expect(findByPkMock).toHaveBeenCalledWith(businessJson.id);
            });

            it("should return an business object", async () => {
                const result = await businessRepo.findById(businessJson.id);
                expect(result).toEqual(businessJson);
            });
        });

        describe("Given the business does not exist", () => {
            it("should return null", async () => {
                findByPkMock.mockResolvedValue(null);
                const result = await businessRepo.findById(businessJson.id);
                expect(result).toBe(null);
            });
        });
    });
});
