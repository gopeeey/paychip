import { BusinessRepo, Business } from "@data/business";
import { sessionMock } from "src/__tests__/mocks";
import {
    accountJson,
    businessData,
    businessJson,
    businessJsonArr,
    businessObj,
    businessObjArr,
} from "../../samples";

const modelContext = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
};

const businessRepo = new BusinessRepo(modelContext as unknown as typeof Business);

describe("TESTING BUSINESS REPO", () => {
    describe("Testing create", () => {
        it("should return business object", async () => {
            modelContext.create.mockResolvedValue(businessObj);
            const data = [businessData, sessionMock] as const;
            const business = await businessRepo.create(...data);
            expect(business).toEqual(businessJson);
            expect(modelContext.create).toHaveBeenCalledTimes(1);
            expect(modelContext.create).toHaveBeenCalledWith(data[0], { transaction: data[1] });
        });
    });

    describe("Testing findById method", () => {
        describe("Given the business exists", () => {
            it("should call the correct method on the model", async () => {
                modelContext.findByPk.mockResolvedValue(businessObj);
                await businessRepo.findById(businessJson.id);
                expect(modelContext.findByPk).toHaveBeenCalledTimes(1);
                expect(modelContext.findByPk).toHaveBeenCalledWith(businessJson.id);
            });

            it("should return an business object", async () => {
                const result = await businessRepo.findById(businessJson.id);
                expect(result).toEqual(businessJson);
            });
        });

        describe("Given the business does not exist", () => {
            it("should return null", async () => {
                modelContext.findByPk.mockResolvedValue(null);
                const result = await businessRepo.findById(businessJson.id);
                expect(result).toBe(null);
            });
        });
    });

    describe("Testing getOwnerBusinesses", () => {
        describe("Given the owner has businesses", () => {
            it("should return a business json array", async () => {
                modelContext.findAll.mockResolvedValue(businessObjArr);
                const result = await businessRepo.getOwnerBusinesses(accountJson.id);
                expect(result).toEqual(businessJsonArr);
                expect(modelContext.findAll).toHaveBeenCalledTimes(1);
            });
        });

        describe("Given the owner has no businesses", () => {
            it("should return an empty array", async () => {
                modelContext.findAll.mockResolvedValue([]);
                const result = await businessRepo.getOwnerBusinesses(accountJson.id);
                expect(result).toEqual([]);
                expect(modelContext.findAll).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("Testing getFullBusiness", () => {
        describe("Given the business exists", () => {
            it("should return a business json object", async () => {
                modelContext.findByPk.mockResolvedValue(businessObj);
                const business = await businessRepo.getFullBusiness(businessJson.id);
                expect(business).toEqual(businessJson);
                expect(modelContext.findByPk).toHaveBeenCalledTimes(1);
                expect(modelContext.findByPk).toHaveBeenCalledWith(businessJson.id, {
                    include: "currencies",
                });
            });
        });

        describe("Given the business does not exist", () => {
            it("should return null", async () => {
                modelContext.findByPk.mockResolvedValue(null);
                const business = await businessRepo.getFullBusiness(businessJson.id);
                expect(business).toBe(null);
            });
        });
    });
});
