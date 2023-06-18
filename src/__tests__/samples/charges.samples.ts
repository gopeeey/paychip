import {
    ChargeDto,
    ChargeStackDto,
    ChargeStackModelInterface,
    CreateChargeStackDto,
    StandardChargeStackDto,
} from "@charges/logic";
import { generateId } from "src/utils";
import { SeedingError } from "../test_utils";
import { getAWallet, walletJson, walletSeeder } from "./wallet.samples";
import { Pool } from "pg";
import { DbChargeStack, addStackToWalletQuery, createChargeStackQuery } from "@charges/data";
import { runQuery } from "@data/db";
import SQL from "sql-template-strings";

const sharedData = {
    businessId: walletJson.businessId,
    description: "Something here",
    name: "Sample charge stack",
    charges: [],
};

export const chargeStackData = {
    wallet: new CreateChargeStackDto({ ...sharedData, paidBy: "wallet" }),
    customer: new CreateChargeStackDto({ ...sharedData, paidBy: "customer" }),
};

export const chargeStackJson = {
    wallet: { ...chargeStackData.wallet, id: "some" },
    customer: { ...chargeStackData.customer, id: "some" },
};

export const standardChargeStack = {
    wallet: new StandardChargeStackDto(chargeStackJson.wallet),
    customer: new StandardChargeStackDto(chargeStackJson.customer),
};

export const getAChargeStack = async (pool: Pool, id?: ChargeStackModelInterface["id"]) => {
    let query = SQL`SELECT * FROM "chargeStacks" LIMIT 1;`;
    if (id) query = SQL`SELECT * FROM "chargeStacks" WHERE "id" = ${id} LIMIT 1;`;
    const res = await runQuery<ChargeStackModelInterface>(query, pool);
    const stack = res.rows[0];
    if (!stack) throw new SeedingError("No charge stacks found");
    return stack;
};

export const getAChargeStackWithBusinessId = async (
    pool: Pool,
    businessId: ChargeStackModelInterface["businessId"]
) => {
    let query = SQL`SELECT * FROM "chargeStacks" WHERE "businessId" = ${businessId} LIMIT 1;`;
    const res = await runQuery<DbChargeStack>(query, pool);
    const stack = res.rows[0];
    if (!stack) throw new SeedingError("No charge stacks found");
    return new ChargeStackDto({ ...stack, charges: JSON.parse(stack.charges) });
};

export const chargesSeeder = async (pool: Pool) => {
    await walletSeeder(pool);
    const wallet = await getAWallet(pool);
    const sampleData = new CreateChargeStackDto({
        name: "Sample sender stack",
        description: "Just an example",
        businessId: wallet.businessId,
        paidBy: "wallet",
        charges: [
            new ChargeDto({
                flatCharge: 2000,
                minimumPrincipalAmount: 0,
                percentageCharge: 1,
                percentageChargeCap: 400000,
            }),
            new ChargeDto({
                flatCharge: 1000,
                minimumPrincipalAmount: 500000,
                percentageCharge: 1,
                percentageChargeCap: 400000,
            }),
        ],
    });

    await runQuery(
        createChargeStackQuery({ ...sampleData, id: generateId(wallet.businessId) }),
        pool
    );

    const stack = await getAChargeStack(pool);
    await runQuery(
        addStackToWalletQuery({
            chargeStackId: stack.id,
            chargeType: "funding",
            walletId: wallet.id,
        }),
        pool
    );
};
