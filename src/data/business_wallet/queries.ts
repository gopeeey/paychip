import { BusinessWalletModelInterface, CreateBusinessWalletDto } from "@logic/business_wallet";
import SQL from "sql-template-strings";

interface CreateQueryInputInterface extends CreateBusinessWalletDto {
    id: BusinessWalletModelInterface["id"];
}
export const createBusinessWalletQuery = (businessWallet: CreateQueryInputInterface) => {
    console.log("\n\n\nBW: ", businessWallet);
    return SQL`
        INSERT INTO "businessWallets" 
        ("id", "businessId", "currencyCode")
        VALUES
        (
            ${businessWallet.id}, 
            ${businessWallet.businessId}, 
            ${businessWallet.currencyCode}
        ) RETURNING *;
    `;
};

export const getByCurrencyQuery = (
    businessId: BusinessWalletModelInterface["businessId"],
    currencyCode: BusinessWalletModelInterface["currencyCode"]
) => {
    return SQL`
        SELECT * FROM "businessWallets" 
        WHERE "businessId" = ${businessId} AND 
        "currencyCode" = ${currencyCode};
    `;
};
