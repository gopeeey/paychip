import { CustomerService } from "../../../../logic/services";
import { CustomerServiceDependencies } from "../../../../contracts/interfaces";
import { customerData, customerJson, customerJsonArray, customerObj } from "../../../samples";

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
            repo.create.mockResolvedValue(customerJson);
            const customer = await customerService.createCustomer(customerData);
            expect(customer).toEqual(customerJson);
            expect(repo.create).toHaveBeenCalledTimes(1);
            expect(repo.create).toHaveBeenCalledWith(customerData);
        });
    });

    describe("testing getBusinessCustomers", () => {
        describe("given customers with passed businessId exist", () => {
            it("should return an array of standard customer objects", async () => {
                repo.getByBusinessId.mockResolvedValue(customerJsonArray);
                const customers = await customerService.getBusinessCustomers(
                    customerJson.businessId
                );
                expect(customers).toEqual(customerJsonArray);
                expect(repo.getByBusinessId).toHaveBeenCalledTimes(1);
                expect(repo.getByBusinessId).toHaveBeenLastCalledWith(customerJson.businessId);
            });
        });

        describe("given no customer with passed businessId exists", () => {
            it("should return an array of customer objects", async () => {
                repo.getByBusinessId.mockResolvedValue([]);
                const customers = await customerService.getBusinessCustomers(
                    customerJson.businessId
                );
                expect(customers).toEqual([]);
            });
        });
    });
});
