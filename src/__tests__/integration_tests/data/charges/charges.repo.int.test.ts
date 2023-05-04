import { ChargesRepo } from "@data/charges/charges.repo";
import {
    AddChargeStackToWalletDto,
    allowedChargeTypes,
    ChargeStackModelInterface,
    CreateChargeStackDto,
    WalletChargeStackModelInterface,
} from "@logic/charges";
import {
    chargesSeeder,
    getAChargeStackWithBusinessId,
} from "src/__tests__/samples/charges.samples";
import { DBSetup } from "src/__tests__/test_utils";
import { getAWallet } from "src/__tests__/samples";
import { runQuery } from "@data/db";
import SQL from "sql-template-strings";

const pool = DBSetup(chargesSeeder);

const chargesRepo = new ChargesRepo(pool);

describe("TESTING CHARGES REPO", () => {
    describe("Testing createChargeStack", () => {
        it("should persist and return a charge stack object", async () => {
            const session = await chargesRepo.startSession();
            const wallet = await getAWallet(pool);
            const data = new CreateChargeStackDto({
                businessId: wallet.businessId,
                name: "Sweet stack",
                description: "stack with lots of sugar",
                paidBy: "wallet",
                charges: "[]",
            });

            const chargeStack = await chargesRepo.createChargeStack(data, session);
            await session.commit();

            if (!chargeStack) throw new Error("Did not return charge stack");
            const res = await runQuery<ChargeStackModelInterface>(
                SQL`SELECT * FROM "chargeStacks" WHERE id = ${chargeStack.id}`,
                pool
            );
            const persistedStack = res.rows[0];
            if (!persistedStack) throw new Error("Failed to persist charge stack");
            expect(persistedStack).toMatchObject(data);
        });
    });

    describe("Testing addStackToWallet", () => {
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

    describe("Testing getStackById", () => {
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
});
