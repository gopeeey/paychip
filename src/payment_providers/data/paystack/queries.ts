import SQL from "sql-template-strings";
import { TransferRecipient } from "./interfaces";
import { BankDetails } from "@payment_providers/logic";

export const createTransferRecipient = (data: TransferRecipient) => {
    return SQL`
        INSERT INTO "paystackTransferRecipients" 
        (
            "recipientId",
            "accountNumber",
            "bankCode",
            "currency"
        ) VALUES (
            ${data.recipientId},
            ${data.accountNumber},
            ${data.bankCode},
            ${data.currency}
        ) RETURNING *;
    `;
};

export const getTransferRecipient = (data: BankDetails) => {
    return SQL`
        SELECT * FROM "paystackTransferRecipients"
        WHERE
        "accountNumber" = ${data.accountNumber} AND
        "bankCode" = ${data.bankCode};
    `;
};
