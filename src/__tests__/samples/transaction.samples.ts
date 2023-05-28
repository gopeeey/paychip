import { createTransactionQuery } from "@data/transaction";
import { CreateTransactionDto, TransactionModelInterface } from "@logic/transaction";
import { generateId } from "src/utils";
import { customerJson, customerSeeder, getACustomer } from "./customer.samples";
import { getAWallet, walletJson, walletSeeder } from "./wallet.samples";
import { bwJson } from "./business_wallet.samples";
import { Pool } from "pg";
import { runQuery } from "@data/db";

export const transactionData = new CreateTransactionDto({
    customerId: customerJson.complete.id,
    businessId: walletJson.businessId,
    transactionType: "credit",
    currency: "NGN",
    bwId: bwJson.id,
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
    console.log("\n\n\nTHIS IS THE CUSTOMER", customer);

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
    console.log("\n\n\nTHIS IS THE QUERY", query);
    await runQuery(query, pool);

    // await Transaction.bulkCreate([
    //     {
    //         ...data,
    //         id: generateId(wallet.businessId),
    //     },
    //     {
    //         ...data,
    //         customerId: customer.id,
    //         id: generateId(wallet.businessId),
    //     },
    // ]);
};
