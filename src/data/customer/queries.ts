import { CustomerModelInterface } from "@logic/customer";
import SQL from "sql-template-strings";

export const createCustomerQuery = (customer: CustomerModelInterface) => {
    return SQL`
        INSERT INTO "customers" 
        ("id", "businessId", "name", "email", "phone") 
        VALUES (
            ${customer.id}, 
            ${customer.businessId}, 
            ${customer.name}, 
            ${customer.email}, 
            ${customer.phone}
        ) RETURNING *;
    `;
};

export const getByBusinessIdQuery = (businessId: CustomerModelInterface["businessId"]) => {
    return SQL`SELECT * FROM "customers" WHERE "businessId" = ${businessId};`;
};
