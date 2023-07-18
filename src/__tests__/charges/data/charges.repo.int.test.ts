import { ChargesRepo, DbChargeStack, geWalletChargeStackObjectQuery } from "@charges/data";
import {
    AddChargeStackToWalletDto,
    allowedChargeTypes,
    ChargeStackDto,
    ChargeStackModelInterface,
    CreateChargeStackDto,
    GetWalletChargeStackDto,
    WalletChargeStackModelInterface,
} from "@charges/logic";
import {
    chargesSeeder,
    getAChargeStackWithBusinessId,
} from "src/__tests__/helpers/samples/charges.samples";
import { DBSetup } from "src/__tests__/helpers/test_utils";
import { getAWallet } from "src/__tests__/helpers/samples";
import { runQuery } from "@db/postgres";
import SQL from "sql-template-strings";

const pool = DBSetup(chargesSeeder);

const chargesRepo = new ChargesRepo(pool);

describe("TESTING CHARGES REPO", () => {
    describe(">>> parseChargeStack", () => {
        it("should return a ChargeStackDto", () => {
            const data: DbChargeStack = {
                id: "asdlkj",
                businessId: 1,
                name: "Sweet stack",
                description: "stack with lots of sugar",
                paidBy: "wallet",
                charges: "[]",
                createdAt: new Date().toISOString(),
            };

            const result = chargesRepo.parseChargeStack(data);
            const expected = { ...data, charges: JSON.parse(data.charges) };
            expect(expected).toMatchObject(result);
        });
    });

    describe(">>> createChargeStack", () => {
        it("should persist and return a charge stack object", async () => {
            const session = await chargesRepo.startSession();
            const wallet = await getAWallet(pool);
            const data = new CreateChargeStackDto({
                businessId: wallet.businessId,
                name: "Sweet stack",
                description: "stack with lots of sugar",
                paidBy: "wallet",
                charges: [],
            });

            const chargeStack = await chargesRepo.createChargeStack(data, session);
            await session.commit();
            await session.end();

            if (!chargeStack) throw new Error("Did not return charge stack");
            const res = await runQuery<DbChargeStack>(
                SQL`SELECT * FROM "chargeStacks" WHERE id = ${chargeStack.id}`,
                pool
            );
            const persistedStack = res.rows[0];
            if (!persistedStack) throw new Error("Failed to persist charge stack");
            expect(chargesRepo.parseChargeStack(persistedStack)).toMatchObject(data);
        });
    });

    describe(">>> addStackToWallet", () => {
        it("should create a new unique record in the wallet charge stack joining table", async () => {
            const wallet = await getAWallet(pool);
            const chargeStack = await getAChargeStackWithBusinessId(pool, wallet.businessId);

            for (const chargeType of allowedChargeTypes) {
                const data = new AddChargeStackToWalletDto({
                    walletId: wallet.id,
                    chargeStackId: chargeStack.id,
                    chargeType,
                });
                await chargesRepo.addStackToWallet(data);

                const res = await runQuery<WalletChargeStackModelInterface>(
                    SQL`
                        SELECT * FROM "walletChargeStacks" 
                        WHERE "walletId" = ${wallet.id} AND 
                        "chargeStackId" = ${chargeStack.id} AND 
                        "chargeType" = ${chargeType};
                    `,
                    pool
                );
                const persistedStack = res.rows[0];
                if (!persistedStack) throw new Error(`${chargeType} charge stack not persisted`);
                expect(persistedStack).toMatchObject(data);
            }
        });
    });

    describe(">>> getStackById", () => {
        describe("Given the charge stack exists", () => {
            it("should return the correct charge stack", async () => {
                const wallet = await getAWallet(pool);
                const sample = await getAChargeStackWithBusinessId(pool, wallet.businessId);
                const result = await chargesRepo.getStackById(sample.id);
                expect(result).toMatchObject(sample);
            });
        });

        describe("Given the charge stack does not exist", () => {
            it("should return null", async () => {
                const result = await chargesRepo.getStackById("does not exist");
                expect(result).toBeNull();
            });
        });
    });

    describe(">>> getWalletChargeStack", () => {
        describe("given the charge stack exists", () => {
            it("should return a parsed charge stack object", async () => {
                const wallet = await getAWallet(pool);

                const chargeStack = await chargesRepo.getWalletChargeStack(wallet.id, "funding");
                if (!chargeStack) throw new Error("Failed to return a charge stack");
                const data = new GetWalletChargeStackDto({
                    walletId: wallet.id,
                    chargeStackId: chargeStack.id,
                    chargeType: "funding",
                });

                const res = await runQuery<WalletChargeStackModelInterface>(
                    geWalletChargeStackObjectQuery(data),
                    pool
                );

                const walletChargeStack = res.rows[0];
                if (!walletChargeStack)
                    throw new Error("Returned charge stack is not associated with wallet");

                expect(chargeStack.id).toBe(walletChargeStack.chargeStackId);
            });
        });

        describe("given the charge stack does not exist", () => {
            it("should return null", async () => {
                const chargeStack = await chargesRepo.getWalletChargeStack(
                    "doesnotexist",
                    "funding"
                );
                expect(chargeStack).toBeNull();
            });
        });
    });
});
