import { CustomerRepo } from "@customer/data";
import { runQuery } from "@db/postgres";
import {
    CreateCustomerDto,
    CustomerModelInterface,
    GetSingleBusinessCustomerDto,
} from "@customer/logic";
import SQL from "sql-template-strings";
import { customerSeeder, getABusiness, getACustomer } from "src/__tests__/helpers/samples";
import { DBSetup } from "src/__tests__/helpers/test_utils";

const pool = DBSetup(customerSeeder);

const customerRepo = new CustomerRepo(pool);

describe("TESTING CUSTOMER REPO", () => {
    describe("testing create", () => {
        it("should return a new customer object", async () => {
            const session = await customerRepo.startSession();
            const business = await getABusiness(pool);

            const data: CreateCustomerDto = {
                businessId: business.id,
                email: "customer@business.com",
                name: "Person",
                phone: "+2349090909090",
            };

            const customer = await customerRepo.create(data, session);
            await session.commit();
            const res = await runQuery<CustomerModelInterface>(
                SQL`SELECT * FROM "customers" WHERE "id" = ${customer.id};`,
                pool
            );

            const persistedCustomer = res.rows[0];
            if (!persistedCustomer) throw new Error("Customer not persisted");

            expect(persistedCustomer).toMatchObject(data);
        });
    });

    describe("testing getByBusinessId", () => {
        describe("given a customer with passed businessId exists", () => {
            it("should return an array of customers", async () => {
                const existing = await getACustomer(pool);

                const customers = await customerRepo.getByBusinessId(existing.businessId);

                expect(customers).toEqual([existing]);
            });
        });

        describe("given no customer with passed businessId exists", () => {
            it("should return an empty array", async () => {
                const customers = await customerRepo.getByBusinessId(8888);
                expect(customers).toEqual([]);
            });
        });
    });

    describe("testing getSingleBusinessCustomer", () => {
        describe("given the customer exists", () => {
            it("should return a customer object", async () => {
                const cust = await getACustomer(pool);
                const data = new GetSingleBusinessCustomerDto({
                    businessId: cust.businessId,
                    email: cust.email,
                });

                const customer = await customerRepo.getSingleBusinessCustomer(data);
                expect(customer).toMatchObject(cust);
            });
        });

        describe("given the customer does not exist", () => {
            it("should return null", async () => {
                const data = new GetSingleBusinessCustomerDto({
                    businessId: 12345,
                    email: "not@found.com",
                });

                const customer = await customerRepo.getSingleBusinessCustomer(data);
                expect(customer).toBeNull();
            });
        });
    });
});
