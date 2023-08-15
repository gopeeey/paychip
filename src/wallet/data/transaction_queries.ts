import {
    TransactionModelInterface,
    TransactionStatusType,
    UpdateTransactionInfoDto,
} from "@wallet/logic";
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

export const createMultipleTransactionsQuery = (transactions: CreateTransactionArgType[]) => {
    const query = SQL`
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
        )
    `;
    query.append(` VALUES `);
    const values = transactions
        .map(
            (transaction) => `(
            ${transaction.id == null ? null : `'${transaction.id}'`},
            ${transaction.businessId == null ? null : `'${transaction.businessId}'`},
            ${transaction.customerId == null ? null : `'${transaction.customerId}'`},
            ${transaction.transactionType == null ? null : `'${transaction.transactionType}'`},
            ${transaction.currency == null ? null : `'${transaction.currency}'`},
            ${transaction.bwId == null ? null : `'${transaction.bwId}'`},
            ${transaction.status == null ? null : `'${transaction.status}'`},
            ${transaction.channel == null ? null : `'${transaction.channel}'`},
            ${transaction.amount == null ? null : `'${transaction.amount}'`},
            ${transaction.settledAmount == null ? null : `'${transaction.settledAmount}'`},
            ${transaction.senderPaid == null ? null : `'${transaction.senderPaid}'`},
            ${transaction.receiverPaid == null ? null : `'${transaction.receiverPaid}'`},
            ${transaction.businessPaid == null ? null : `'${transaction.businessPaid}'`},
            ${transaction.businessCharge == null ? null : `'${transaction.businessCharge}'`},
            ${transaction.platformCharge == null ? null : `'${transaction.platformCharge}'`},
            ${transaction.businessGot == null ? null : `'${transaction.businessGot}'`},
            ${transaction.platformGot == null ? null : `'${transaction.platformGot}'`},
            ${
                transaction.businessChargePaidBy == null
                    ? null
                    : `'${transaction.businessChargePaidBy}'`
            },
            ${
                transaction.platformChargePaidBy == null
                    ? null
                    : `'${transaction.platformChargePaidBy}'`
            },
            ${transaction.senderWalletId == null ? null : `'${transaction.senderWalletId}'`},
            ${transaction.receiverWalletId == null ? null : `'${transaction.receiverWalletId}'`},
            ${transaction.reference == null ? null : `'${transaction.reference}'`},
            ${transaction.provider == null ? null : `'${transaction.provider}'`},
            ${transaction.providerRef == null ? null : `'${transaction.providerRef}'`},
            ${transaction.bankName == null ? null : `'${transaction.bankName}'`},
            ${transaction.accountNumber == null ? null : `'${transaction.accountNumber}'`},
            ${transaction.bankCode == null ? null : `'${transaction.bankCode}'`},
            ${transaction.accountName == null ? null : `'${transaction.accountName}'`},
            ${transaction.cardNumber == null ? null : `'${transaction.cardNumber}'`},
            ${transaction.cardType == null ? null : `'${transaction.cardType}'`},
            ${transaction.callbackUrl == null ? null : `'${transaction.callbackUrl}'`}
        )`
        )
        .join(", ");
    query.append(values);
    query.append(` RETURNING *`);

    return query;
};

export const getByReferenceQuery = (reference: string) => {
    return SQL`
        SELECT * FROM "transactions" WHERE "reference" = ${reference};
    `;
};

export const updateReferenceQuery = (
    transactionId: TransactionModelInterface["id"],
    reference: TransactionModelInterface["reference"]
) => {
    return SQL`
        UPDATE "transactions" SET "reference" = ${reference} WHERE "id" = ${transactionId};
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

export const getPendingDebitThatHaveProviderRefQuery = () => {
    return SQL`
        SELECT "id", "reference", "provider", "providerRef"
        FROM "transactions" 
        WHERE "status" = 'pending'
        AND "transactionType" = 'debit'
        AND "providerRef" IS NOT NULL;
    `;
};
