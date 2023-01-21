import { BusinessRepo } from "../../../db/repos";
import { Business } from "../../../db/models";
import { businessData, businessJson, businessObj } from "../../samples";

const createMock = jest.fn();
const findAllMock = jest.fn();
const modelContext = {
    create: createMock,
    findAll: findAllMock,
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
});
