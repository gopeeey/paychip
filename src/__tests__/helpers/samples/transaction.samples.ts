import { createTransactionQuery } from "@wallet/data";
import { CreateTransactionDto, TransactionModelInterface } from "@wallet/logic";
import { generateId } from "src/utils";
import { customerJson, customerSeeder, getACustomer } from "./customer.samples";
import { businessWalletJson, getAWallet, walletJson, walletSeeder } from "./wallet.samples";
import { Pool } from "pg";
import { runQuery } from "@db/postgres";
import SQL from "sql-template-strings";
import { SeedingError } from "../test_utils";

export const transactionData = new CreateTransactionDto({
    customerId: customerJson.complete.id,
    businessId: walletJson.businessId,
    transactionType: "credit",
    currency: "NGN",
    bwId: businessWalletJson.id,
    channel: "bank",
    amount: 2000,
    settledAmount: 1800,
    senderPaid: 2000,
    receiverPaid: 200,
    businessPaid: 20,
    businessCharge: 200,
    platformCharge: 20,
    businessGot: 1980,
    platformGot: 2000,
    businessChargePaidBy: "wallet",
    platformChargePaidBy: "wallet",
    senderWalletId: walletJson.id,
    accountName: "Someone's account",
    accountNumber: "1234567890",
    bankCode: "021",
    bankName: "Example bank",
    provider: "paystack",
    reference: "someref",
});

export const transactionJson: TransactionModelInterface = {
    ...transactionData,
    channel: "bank",
    id: "somehere",
    status: "pending",
};

export const transactionSeeder = async (pool: Pool) => {
    await walletSeeder(pool);
    const wallet = await getAWallet(pool);

    await customerSeeder(pool, wallet.businessId, wallet.id);
    const customer = await getACustomer(pool);

    const data = new CreateTransactionDto({
        ...transactionData,
        businessId: wallet.businessId,
        bwId: wallet.businessWalletId,
        senderWalletId: wallet.id,
        customerId: customer.id,
    });

    const query = createTransactionQuery({
        ...data,
        channel: "bank",
        id: generateId(wallet.businessId),
    });
    await runQuery(query, pool);
};

export const getATransaction = async (pool: Pool, id?: TransactionModelInterface["id"]) => {
    let query = SQL`SELECT * FROM "transactions" LIMIT 1;`;
    if (id) query = SQL`SELECT * FROM "transactions" WHERE "id" = ${id} LIMIT 1;`;
    const res = await runQuery<TransactionModelInterface>(query, pool);
    const wallet = res.rows[0];
    if (!wallet) throw new SeedingError("No wallets found");
    return wallet;
};
