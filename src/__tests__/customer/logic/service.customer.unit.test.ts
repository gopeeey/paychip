import { CustomerRepo } from "@customer/data";
import {
    CreateCustomerDto,
    CustomerService,
    CustomerServiceDependencies,
    GetSingleBusinessCustomerDto,
} from "@customer/logic";
import { Pool } from "pg";
import { createSpies } from "src/__tests__/helpers/mocks";
import { customerData, customerJson, customerJsonArray } from "src/__tests__/helpers/samples";

const repoMock = createSpies(new CustomerRepo({} as Pool));

const dependencies: CustomerServiceDependencies = {
    repo: repoMock as unknown as CustomerServiceDependencies["repo"],
};

const customerService = new CustomerService(dependencies);

describe("TESTING CUSTOMER SERVICE", () => {
    describe("testing createCustomer", () => {
        it("should return a customer object", async () => {
            repoMock.create.mockResolvedValue(customerJson.complete);
            const customer = await customerService.createCustomer(customerData.complete);
            expect(customer).toEqual(customerJson.complete);
            expect(repoMock.create).toHaveBeenCalledTimes(1);
            expect(repoMock.create).toHaveBeenCalledWith(customerData.complete);
        });
    });

    describe("testing getBusinessCustomers", () => {
        describe("given customers with passed businessId exist", () => {
            it("should return an array of standard customer objects", async () => {
                repoMock.getByBusinessId.mockResolvedValue(customerJsonArray.complete);
                const customers = await customerService.getBusinessCustomers(
                    customerJson.complete.businessId
                );
                expect(customers).toEqual(customerJsonArray.complete);
                expect(repoMock.getByBusinessId).toHaveBeenCalledTimes(1);
                expect(repoMock.getByBusinessId).toHaveBeenLastCalledWith(
                    customerJson.complete.businessId
                );
            });
        });

        describe("given no customer with passed businessId exists", () => {
            it("should return an array of customer objects", async () => {
                repoMock.getByBusinessId.mockResolvedValue([]);
                const customers = await customerService.getBusinessCustomers(
                    customerJson.complete.businessId
                );
                expect(customers).toEqual([]);
            });
        });
    });

    describe("testing getOrCreateCustomer", () => {
        const data = new GetSingleBusinessCustomerDto(customerJson.complete);

        it("should try to fetch the customer", async () => {
            repoMock.getSingleBusinessCustomer.mockResolvedValue(customerJson.complete);
            await customerService.getOrCreateCustomer(data);
            expect(repoMock.getSingleBusinessCustomer).toHaveBeenCalledTimes(1);
            expect(repoMock.getSingleBusinessCustomer).toHaveBeenCalledWith(data);
        });

        describe("given the customer exists", () => {
            it("should return the customer object", async () => {
                const customer = await customerService.getOrCreateCustomer(data);
                expect(customer).toMatchObject(data);
                expect(repoMock.create).toHaveBeenCalledTimes(0);
            });
        });

        describe("given the customer does not exist", () => {
            it("should create and return a new customer", async () => {
                repoMock.getSingleBusinessCustomer.mockResolvedValue(null);
                repoMock.create.mockResolvedValue(customerJson.complete);
                const customer = await customerService.getOrCreateCustomer(data);
                expect(customer).toMatchObject(data);
                expect(repoMock.create).toHaveBeenCalledTimes(1);

                const createDto = new CreateCustomerDto(data);
                expect(repoMock.create).toHaveBeenCalledWith(createDto);
            });
        });
    });
});
