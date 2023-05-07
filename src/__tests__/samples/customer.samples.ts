import { CreateCustomerDto, CustomerModelInterface, StandardCustomerDto } from "@logic/customer";
import { businessSeeder, getABusiness } from "./business.samples";
import { generateId } from "src/utils";
import { BusinessModelInterface } from "@logic/business";
import { Pool } from "pg";
import { runQuery } from "@data/db";
import { createCustomerQuery, createWalletCustomerQuery } from "@data/customer";
import SQL from "sql-template-strings";
import { SeedingError } from "../test_utils";
import { WalletModelInterface } from "@logic/wallet";

export const customerData = {
    complete: new CreateCustomerDto({
        name: "Samuel Customer",
        email: "sammygopeh@gmail.com",
        phone: "+23412345678",
        businessId: 1234,
    }),

    incomplete: new CreateCustomerDto({
        email: "sammygopeh@gmail.com",
        businessId: 1234,
    }),
};

export const customerJson: {
    [key in "complete" | "incomplete"]: CustomerModelInterface;
} = {
    complete: { ...customerData.complete, id: "something" },
    incomplete: { ...customerData.incomplete, id: "something" },
};

export const customerJsonArray = {
    complete: [customerJson.complete],
    incomplete: [customerJson.incomplete],
    mixed: [customerJson.complete, customerJson.incomplete],
};

export const standardCustomer = {
    complete: new StandardCustomerDto(customerJson.complete),
    incomplete: new StandardCustomerDto(customerJson.incomplete),
};

export const standardCustomerArr = {
    complete: [standardCustomer.complete],
    incomplete: [standardCustomer.incomplete],
    mixed: [standardCustomer.complete, standardCustomer.incomplete],
};

export const customerSeeder = async (
    pool: Pool,
    businessId?: BusinessModelInterface["id"],
    walletId?: WalletModelInterface["id"]
) => {
    if (!businessId) {
        await businessSeeder(pool);
        const business = await getABusiness(pool);
        businessId = business.id;
    }

    const customerId = generateId(businessId);
    const customer: CustomerModelInterface = {
        id: customerId,
        ...customerData.complete,
        businessId: businessId,
    };

    await runQuery(createCustomerQuery(customer), pool);
    if (walletId) await runQuery(createWalletCustomerQuery({ customerId, walletId }), pool);
};

export const getACustomer = async (pool: Pool, businessId?: BusinessModelInterface["id"]) => {
    let query = SQL`SELECT * FROM "customers" LIMIT 1;`;
    if (businessId)
        query = SQL`SELECT * FROM "customers" WHERE "businessId" = ${businessId} LIMIT 1;`;
    const res = await runQuery<CustomerModelInterface>(query, pool);
    const customer = res.rows[0];
    if (!customer) throw new SeedingError("No customers found");
    return customer;
};
