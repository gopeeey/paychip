import { Business } from "@data/business";
import { CustomerRepo, Customer } from "@data/customer";
import { runQuery } from "@data/db";
import { StartSequelizeSession } from "@data/sequelize_session";
import { CreateCustomerDto, CustomerModelInterface } from "@logic/customer";
import SQL from "sql-template-strings";
import { customerSeeder, getABusiness, getACustomer } from "src/__tests__/samples";
import { DBSetup, SeedingError } from "src/__tests__/test_utils";

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
});
