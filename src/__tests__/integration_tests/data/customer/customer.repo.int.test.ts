import { Business } from "@data/business";
import { CustomerRepo, Customer } from "@data/customer";
import { StartSequelizeSession } from "@data/sequelize_session";
import { CreateCustomerDto } from "@logic/customer";
import { customerSeeder } from "src/__tests__/samples";
import { DBSetup, SeedingError } from "src/__tests__/test_utils";

const customerRepo = new CustomerRepo(Customer);

DBSetup(customerSeeder);

describe("TESTING CUSTOMER REPO", () => {
    describe("testing create", () => {
        it("should return a new customer object", async () => {
            const session = await StartSequelizeSession();
            const business = await Business.findOne();
            if (!business) throw new SeedingError("business not found");

            const data: CreateCustomerDto = {
                businessId: business.id,
                email: "customer@business.com",
                name: "Person",
                phone: "+2349090909090",
            };

            const customer = await customerRepo.create(data, session);
            await session.commit();
            const persistedCustomer = await Customer.findByPk(customer.id);
            if (!persistedCustomer) throw new Error("Customer not persisted");

            expect(persistedCustomer.toJSON()).toMatchObject(data);
        });
    });

    describe("testing getByBusinessId", () => {
        describe("given a customer with passed businessId exists", () => {
            it("should return an array of customers", async () => {
                const existing = await Customer.findOne();
                if (!existing) throw new SeedingError("customer not found");

                const customers = await customerRepo.getByBusinessId(existing.businessId);
                const existingMatch = customers.find((cust) => cust.id === existing.id);
                if (!existingMatch) throw new Error("Existing not returned as part of list");

                expect(existing).toMatchObject(existingMatch);
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
