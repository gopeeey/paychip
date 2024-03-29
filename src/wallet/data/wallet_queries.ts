import {
    CreateWalletDto,
    GetUniqueWalletDto,
    IncrementBalanceDto,
    WalletModelInterface,
} from "@wallet/logic";
import SQL from "sql-template-strings";

interface CreateWalletQueryInterface extends CreateWalletDto {
    id: WalletModelInterface["id"];
}
export const createWalletQuery = (wallet: CreateWalletQueryInterface) => {
    return SQL`
        INSERT INTO "wallets" (
            "id",
            "businessId",
            "businessWalletId",
            "currency",
            "email",
            "isBusinessWallet",
            "waiveFundingCharges",
            "waiveWithdrawalCharges",
            "waiveWalletInCharges",
            "waiveWalletOutCharges"
        ) 
        VALUES (
            ${wallet.id},
            ${wallet.businessId},
            ${wallet.businessWalletId},
            ${wallet.currency},
            ${wallet.email},
            ${wallet.isBusinessWallet},
            ${wallet.waiveFundingCharges},
            ${wallet.waiveWithdrawalCharges},
            ${wallet.waiveWalletInCharges},
            ${wallet.waiveWalletOutCharges}
        ) RETURNING *;
    `;
};

export const getByIdQuery = (id: WalletModelInterface["id"]) => {
    return SQL`
        SELECT * FROM "wallets" WHERE "id" = ${id};
    `;
};

export const getByIdWithBusinessWalletQuery = (id: WalletModelInterface["id"]) => {
    return SQL`
        SELECT json_build_object(
            'wallet', w,
            'businessWallet', bw
        ) AS "walletWithBusinessWallet"
        FROM "wallets" AS w
        LEFT OUTER JOIN "wallets" AS bw ON w."businessWalletId" = bw.id
        WHERE w.id = ${id};
    `;
};

export const getUniqueQuery = (unique: GetUniqueWalletDto) => {
    return SQL`
        SELECT * FROM "wallets" 
        WHERE "businessId" = ${unique.businessId} 
        AND "email" = ${unique.email} 
        AND "currency" = ${unique.currency}
        AND "isBusinessWallet" = ${unique.isBusinessWallet};
    `;
};

export const getBusinessWalletByCurrencyQuery = (
    businessId: WalletModelInterface["businessId"],
    currency: WalletModelInterface["currency"]
) => {
    return SQL`
        SELECT * FROM "wallets" 
        WHERE "businessId" = ${businessId} AND 
        "currency" = ${currency} AND "isBusinessWallet" = true;
    `;
};

export const incrementBalanceQuery = (dto: IncrementBalanceDto) => {
    return SQL`
        UPDATE "wallets" SET "balance" = "balance" + ${dto.amount} WHERE "id" = ${dto.walletId};
    `;
};
