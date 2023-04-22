import { ChargeStack, Charge } from "@data/charges";
import {
    ChargeDto,
    ChargeStackModelInterface,
    CreateChargeDto,
    CreateChargeStackDto,
    StandardChargeDto,
    StandardChargeStackDto,
} from "@logic/charges";
import { generateId } from "src/utils";
import { SeedingError } from "../test_utils";
import { getAWallet, walletJson, walletSeeder } from "./wallet.samples";
import { Pool } from "pg";
import { createChargeStackQuery } from "@data/charges";
import { runQuery } from "@data/db";
import SQL from "sql-template-strings";

const sharedData = {
    businessId: walletJson.businessId,
    description: "Something here",
    name: "Sample charge stack",
    charges: "[]",
};

export const chargeStackData = {
    wallet: new CreateChargeStackDto({ ...sharedData, paidBy: "wallet" }),
    customer: new CreateChargeStackDto({ ...sharedData, paidBy: "customer" }),
    noPaidBy: new CreateChargeStackDto({ ...sharedData }),
};

export const chargeStackObj = {
    wallet: new ChargeStack({ ...chargeStackData.wallet, id: "some" }),
    customer: new ChargeStack({ ...chargeStackData.customer, id: "some" }),
    noPaidBy: new ChargeStack({ ...chargeStackData.noPaidBy, id: "some" }),
};

export const chargeStackJson = {
    wallet: chargeStackObj.wallet.toJSON(),
    customer: chargeStackObj.customer.toJSON(),
    noPaidBy: chargeStackObj.noPaidBy.toJSON(),
};

export const standardChargeStack = {
    wallet: new StandardChargeStackDto(chargeStackJson.wallet),
    customer: new StandardChargeStackDto(chargeStackJson.customer),
    noPaidBy: new StandardChargeStackDto(chargeStackJson.noPaidBy),
};

export const chargeData = new CreateChargeDto({
    businessId: 1234,
    flatCharge: 4000,
    minimumPrincipalAmount: 120000,
    name: "For something",
    percentageCharge: 34.5,
    percentageChargeCap: 4000,
});

export const chargeObj = new Charge({ ...chargeData, id: "charge_id" });
export const chargeJson = chargeObj.toJSON();
export const standardCharge = new StandardChargeDto(chargeJson);

export const chargesSeeder = async (pool: Pool) => {
    await walletSeeder(pool);
    const wallet = await getAWallet(pool);
    const sampleData = new CreateChargeStackDto({
        name: "Sample sender stack",
        description: "Just an example",
        businessId: wallet.businessId,
        paidBy: "wallet",
        charges: `[${
            (JSON.stringify(
                new ChargeDto({
                    flatCharge: 2000,
                    minimumPrincipalAmount: 0,
                    percentageCharge: 1,
                    percentageChargeCap: 400000,
                })
            ),
            JSON.stringify(
                new ChargeDto({
                    flatCharge: 1000,
                    minimumPrincipalAmount: 500000,
                    percentageCharge: 1,
                    percentageChargeCap: 400000,
                })
            ))
        }]`,
    });

    await runQuery(
        createChargeStackQuery({ ...sampleData, id: generateId(wallet.businessId) }),
        pool
    );
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
    const res = await runQuery<ChargeStackModelInterface>(query, pool);
    const stack = res.rows[0];
    if (!stack) throw new SeedingError("No charge stacks found");
    return stack;
};
