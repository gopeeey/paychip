import { Customer } from "@data/customer";
import { Transaction } from "@data/transaction";
import { Wallet } from "@data/wallet";
import { CreateTransactionDto } from "@logic/transaction";
import { generateId } from "src/utils";
import { SeedingError } from "../test_utils";
import { customerJson, customerSeeder } from "./customer.samples";
import { walletJson, walletSeeder } from "./wallet.samples";

export const transactionData = new CreateTransactionDto({
    walletId: walletJson.id,
    customerId: customerJson.complete.id,
    businessId: walletJson.businessId,
    amount: 2000,
    channel: "bank",
    charge: 200,
    chargePaidBy: "wallet",
    settledAmount: 1800,
    status: "pending",
    transactionType: "credit",
    accountName: "Someone's account",
    accountNumber: "1234567890",
    bankCode: "021",
    bankName: "Example bank",
    provider: "paystack",
});

export const transactionObj = new Transaction({ ...transactionData, id: "somehere" });

export const transactionJson = transactionObj.toJSON();

export const transactionSeeder = async () => {
    await walletSeeder();
    const wallet = await Wallet.findOne();
    if (!wallet) throw new SeedingError("wallet not found");

    await customerSeeder(wallet.businessId);
    const customer = await Customer.findOne({ where: { businessId: wallet.businessId } });
    if (!customer) throw new SeedingError("customer not found");

    const data = new CreateTransactionDto({
        walletId: wallet.id,
        amount: 2000,
        businessId: wallet.businessId,
        channel: "bank",
        charge: 200,
        chargePaidBy: "wallet",
        settledAmount: 1800,
        status: "pending",
        transactionType: "credit",
        accountName: "Someone's account",
        accountNumber: "1234567890",
        bankCode: "021",
        bankName: "Example bank",
        provider: "paystack",
    });

    await Transaction.bulkCreate([
        {
            ...data,
            id: generateId(wallet.businessId),
        },
        {
            ...data,
            customerId: customer.id,
            id: generateId(wallet.businessId),
        },
    ]);
};
