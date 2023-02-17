import { CustomerRepo } from "../../../db/repos";
import { Customer } from "../../../db/models";
import {
    customerData,
    customerJson,
    customerJsonArray,
    customerObj,
    customerObjArr,
} from "../../samples";

const modelContext = {
    create: jest.fn(),
    findAll: jest.fn(),
};

const customerRepo = new CustomerRepo(modelContext as unknown as typeof Customer);

describe("TESTING CUSTOMER REPO", () => {
    describe("testing create", () => {
        it("should return a new customer object", async () => {
            modelContext.create.mockResolvedValue(customerObj.complete);
            const customer = await customerRepo.create(customerData.complete);
            expect(customer).toEqual(customerJson.complete);
            expect(modelContext.create).toHaveBeenCalledTimes(1);
            expect(modelContext.create).toHaveBeenCalledWith(customerData.complete);
        });
    });

    describe("testing getByBusinessId", () => {
        describe("given a customer with passed businessId exists", () => {
            it("should return an array of customers", async () => {
                modelContext.findAll.mockResolvedValue(customerObjArr.complete);
                const customers = await customerRepo.getByBusinessId(
                    customerJson.complete.businessId
                );
                expect(customers).toEqual(customerJsonArray.complete);
                expect(modelContext.findAll).toHaveBeenCalledTimes(1);
            });
        });

        describe("given no customer with passed businessId exists", () => {
            it("should return an empty array", async () => {
                modelContext.findAll.mockResolvedValue([]);
                const customers = await customerRepo.getByBusinessId(
                    customerJson.complete.businessId
                );
                expect(customers).toEqual([]);
                expect(modelContext.findAll).toHaveBeenCalledTimes(1);
            });
        });
    });
});
