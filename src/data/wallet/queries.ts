import {
    CreateWalletDto,
    GetUniqueWalletDto,
    IncrementBalanceDto,
    WalletModelInterface,
} from "@logic/wallet";
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
            "waiveFundingCharges",
            "waiveWithdrawalCharges",
            "waiveWalletInCharges",
            "waiveWalletOutCharges",
            "fundingChargesPaidBy",
            "withdrawalChargesPaidBy"
        ) 
        VALUES (
            ${wallet.id},
            ${wallet.businessId},
            ${wallet.businessWalletId},
            ${wallet.currency},
            ${wallet.email},
            ${wallet.waiveFundingCharges},
            ${wallet.waiveWithdrawalCharges},
            ${wallet.waiveWalletInCharges},
            ${wallet.waiveWalletOutCharges},
            ${wallet.fundingChargesPaidBy},
            ${wallet.withdrawalChargesPaidBy}
        ) RETURNING *;
    `;
};

export const getByIdQuery = (id: WalletModelInterface["id"]) => {
    return SQL`
        SELECT * FROM "wallets" WHERE "id" = ${id};
    `;
};

export const getUniqueQuery = (unique: GetUniqueWalletDto) => {
    return SQL`
        SELECT * FROM "wallets" 
        WHERE "businessId" = ${unique.businessId} 
        AND "email" = ${unique.email} 
        AND "currency" = ${unique.currency};
    `;
};

export const incrementBalanceQuery = (dto: IncrementBalanceDto) => {
    return SQL`
        UPDATE "wallets" SET "balance" = "balance" + ${dto.amount} WHERE "id" = ${dto.walletId};
    `;
};
