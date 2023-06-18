import { BusinessModelInterface, CreateBusinessDto } from "@business/logic";
import SQL from "sql-template-strings";

export const createBusinessQuery = (business: CreateBusinessDto) => {
    return SQL`
    INSERT INTO businesses 
    ("ownerId", "name", "countryCode") 
    VALUES (
        ${business.ownerId}, 
        ${business.name}, 
        ${business.countryCode}
    ) RETURNING *;`;
};

export const findById = (id: BusinessModelInterface["id"]) => {
    return SQL`
    SELECT * FROM businesses WHERE "id" = ${id};
    `;
};

export const getOwnerBusinesses = (ownerId: BusinessModelInterface["ownerId"]) => {
    return SQL`
    SELECT * FROM businesses WHERE "ownerId" = ${ownerId}
    `;
};
