import { CustomerRepo } from "../../../db/repos";
import { Customer } from "../../../db/models";
import {
    customerData,
    customerJson,
    customerJsonArray,
    customerObj,
    customerObjArr,
} from "../../samples";
import { CreateCustomerDto } from "../../../contracts/dtos";

const modelContext = {
    create: jest.fn(),
    findAll: jest.fn(),
};

const customerRepo = new CustomerRepo(modelContext as unknown as typeof Customer);

describe("TESTING CUSTOMER REPO", () => {
    describe("testing create", () => {
        it("should return a new customer object", async () => {
            modelContext.create.mockResolvedValue(customerObj);
            const customer = await customerRepo.create(customerData);
            expect(customer).toEqual(customerJson);
            expect(modelContext.create).toHaveBeenCalledTimes(1);
            expect(modelContext.create).toHaveBeenCalledWith(customerData);
        });
    });

    describe("testing getByBusinessId", () => {
        describe("given a customer with passed businessId exists", () => {
            it("should return an array of customers", async () => {
                modelContext.findAll.mockResolvedValue(customerObjArr);
                const customers = await customerRepo.getByBusinessId(customerJson.businessId);
                expect(customers).toEqual(customerJsonArray);
                expect(modelContext.findAll).toHaveBeenCalledTimes(1);
            });
        });

        describe("given a customer with passed businessId does not exist", () => {
            it("should return an empty array", async () => {
                modelContext.findAll.mockResolvedValue([]);
                const customers = await customerRepo.getByBusinessId(customerJson.businessId);
                expect(customers).toEqual([]);
                expect(modelContext.findAll).toHaveBeenCalledTimes(1);
            });
        });
    });
});
