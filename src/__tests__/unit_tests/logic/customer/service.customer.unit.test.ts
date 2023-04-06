import { CustomerService, CustomerServiceDependencies } from "@logic/customer";
import { customerData, customerJson, customerJsonArray } from "src/__tests__/samples";

const repo = {
    create: jest.fn(),
    getByBusinessId: jest.fn(),
};

const dependencies = {
    repo: repo as unknown as CustomerServiceDependencies["repo"],
};

const customerService = new CustomerService(dependencies);

describe("TESTING CUSTOMER SERVICE", () => {
    describe("testing createCustomer", () => {
        it("should return a customer object", async () => {
            repo.create.mockResolvedValue(customerJson.complete);
            const customer = await customerService.createCustomer(customerData.complete);
            expect(customer).toEqual(customerJson.complete);
            expect(repo.create).toHaveBeenCalledTimes(1);
            expect(repo.create).toHaveBeenCalledWith(customerData.complete);
        });
    });

    describe("testing getBusinessCustomers", () => {
        describe("given customers with passed businessId exist", () => {
            it("should return an array of standard customer objects", async () => {
                repo.getByBusinessId.mockResolvedValue(customerJsonArray.complete);
                const customers = await customerService.getBusinessCustomers(
                    customerJson.complete.businessId
                );
                expect(customers).toEqual(customerJsonArray.complete);
                expect(repo.getByBusinessId).toHaveBeenCalledTimes(1);
                expect(repo.getByBusinessId).toHaveBeenLastCalledWith(
                    customerJson.complete.businessId
                );
            });
        });

        describe("given no customer with passed businessId exists", () => {
            it("should return an array of customer objects", async () => {
                repo.getByBusinessId.mockResolvedValue([]);
                const customers = await customerService.getBusinessCustomers(
                    customerJson.complete.businessId
                );
                expect(customers).toEqual([]);
            });
        });
    });
});
