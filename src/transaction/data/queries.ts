import { TransactionModelInterface } from "@transaction/logic";
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
