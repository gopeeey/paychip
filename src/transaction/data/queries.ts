import {
    TransactionModelInterface,
    TransactionStatusType,
    UpdateTransactionInfoDto,
} from "@transaction/logic";
import SQL from "sql-template-strings";

interface CreateTransactionArgType extends Omit<TransactionModelInterface, "channel"> {
    channel: TransactionModelInterface["channel"] | null;
}

export const createTransactionQuery = (transaction: CreateTransactionArgType) => {
    return SQL`
        INSERT INTO "transactions" (
            "id",
            "businessId",
            "customerId",
            "transactionType",
            "currency",
            "bwId",
            "status",
            "channel",
            "amount",
            "settledAmount",
            "senderPaid",
            "receiverPaid",
            "businessPaid",
            "businessCharge",
            "platformCharge",
            "businessGot",
            "platformGot",
            "businessChargePaidBy",
            "platformChargePaidBy",
            "senderWalletId",
            "receiverWalletId",
            "reference",
            "provider",
            "providerRef",
            "bankName",
            "accountNumber",
            "bankCode",
            "accountName",
            "cardNumber",
            "cardType",
            "callbackUrl"
        ) VALUES (
            ${transaction.id},
            ${transaction.businessId},
            ${transaction.customerId},
            ${transaction.transactionType},
            ${transaction.currency},
            ${transaction.bwId},
            ${transaction.status},
            ${transaction.channel},
            ${transaction.amount},
            ${transaction.settledAmount},
            ${transaction.senderPaid},
            ${transaction.receiverPaid},
            ${transaction.businessPaid},
            ${transaction.businessCharge},
            ${transaction.platformCharge},
            ${transaction.businessGot},
            ${transaction.platformGot},
            ${transaction.businessChargePaidBy},
            ${transaction.platformChargePaidBy},
            ${transaction.senderWalletId},
            ${transaction.receiverWalletId},
            ${transaction.reference},
            ${transaction.provider},
            ${transaction.providerRef},
            ${transaction.bankName},
            ${transaction.accountNumber},
            ${transaction.bankCode},
            ${transaction.accountName},
            ${transaction.cardNumber},
            ${transaction.cardType},
            ${transaction.callbackUrl}
        ) RETURNING *;
    `;
};

export const getByReferenceQuery = (reference: string) => {
    return SQL`
        SELECT * FROM "transactions" WHERE "reference" = ${reference};
    `;
};

export const updateStatusQuery = (
    transactionId: TransactionModelInterface["id"],
    status: TransactionModelInterface["status"]
) => {
    return SQL`
        UPDATE "transactions" SET "status" = ${status} WHERE "id" = ${transactionId};
    `;
};

export const updateTransactionInfo = (
    transactionId: TransactionModelInterface["id"],
    info: UpdateTransactionInfoDto
) => {
    return SQL`
        UPDATE "transactions" 
        SET "status" = ${info.status}, 
        "channel" = ${info.channel}, 
        "providerRef" = ${info.providerRef},
        "bankName" = ${info.bankName},
        "accountNumber" = ${info.accountNumber},
        "accountName" = ${info.accountName},
        "cardNumber" = ${info.cardNumber},
        "cardType" = ${info.cardType} WHERE "id" = ${transactionId};
    `;
};

export const getByRefAndStatusQuery = (reference: string, status: TransactionStatusType) => {
    return SQL`
        SELECT * FROM "transactions" 
        WHERE "reference" = ${reference}
        AND "status" = ${status};
    `;
};
