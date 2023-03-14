import { Business } from "@data/business";
import { Charge, ChargeStack, WalletChargeStack } from "@data/charges";
import { ChargesRepo } from "@data/charges/charges.repo";
import { Wallet } from "@data/wallet";
import { StartSequelizeSession } from "@data/sequelize_session";
import {
    AddChargeStackToWalletDto,
    allowedChargeStackTypes,
    ChargeStackModelInterface,
    CreateChargeDto,
    CreateChargeStackDto,
} from "@logic/charges";
import { chargesSeeder } from "src/__tests__/samples/charges.samples";
import { DBSetup, SeedingError } from "src/__tests__/test_utils";

DBSetup(chargesSeeder);

const chargesRepo = new ChargesRepo({
    chargeStackModel: ChargeStack,
    walletChargeStackModel: WalletChargeStack,
});

const getAWallet = async () => {
    const wallet = await Wallet.findOne();
    if (!wallet) throw new SeedingError("wallet not found");
    return wallet;
};

const getAStack = async (businessId: ChargeStackModelInterface["businessId"]) => {
    const chargeStack = await ChargeStack.findOne({ where: { businessId } });
    if (!chargeStack) throw new SeedingError("charge stack not found");
    return chargeStack;
};

describe("TESTING CHARGES REPO", () => {
    describe("Testing createChargeStack", () => {
        it("should persist and return a charge stack object", async () => {
            const session = await StartSequelizeSession();
            const wallet = await getAWallet();
            const data = new CreateChargeStackDto({
                businessId: wallet.businessId,
                name: "Sweet stack",
                description: "stack with lots of sugar",
                paidBy: "sender",
            });

            const chargeStack = await chargesRepo.createChargeStack(data, session);
            await session.commit();

            const persistedStack = await ChargeStack.findByPk(chargeStack.id);
            if (!persistedStack) throw new Error("Failed to persist charge stack");
            expect(persistedStack).toMatchObject(data);
        });
    });

    describe("Testing addStackToWallet", () => {
        it("should create a new unique record in the wallet charge stack joining table", async () => {
            const wallet = await getAWallet();
            const chargeStack = await getAStack(wallet.businessId);
            const destroyMock = jest.spyOn(WalletChargeStack, "destroy");

            for (const stackType of allowedChargeStackTypes) {
                destroyMock.mockReset();
                const data = new AddChargeStackToWalletDto({
                    walletId: wallet.id,
                    chargeStackId: chargeStack.id,
                    chargeStackType: stackType,
                    isChildDefault: false,
                });
                await chargesRepo.addStackToWallet(data);

                expect(destroyMock).toHaveBeenCalledTimes(1);

                const persistedStacks = await WalletChargeStack.findAll({ where: { ...data } });
                if (!persistedStacks.length)
                    throw new Error(`${stackType} charge stack not persisted`);
                expect(persistedStacks.length).toBe(1);
                expect(persistedStacks[0]).toMatchObject(data);
            }
        });
    });

    describe("Testing createCharge", () => {
        it.only("should persist and return a charge object", async () => {
            const wallet = await getAWallet();
            const data = new CreateChargeDto({
                businessId: wallet.businessId,
                flatCharge: 100,
                minimumPrincipalAmount: 100,
                name: "Test charge",
                percentageCharge: 20,
                percentageChargeCap: 2000,
            });

            const charge = await chargesRepo.createCharge(data);

            const persistedCharge = await Charge.findByPk(charge.id);
            if (!persistedCharge) throw new Error("Charge not persisted");
            console.log(typeof persistedCharge.flatCharge);
            expect(persistedCharge.toJSON()).toMatchObject(data);
        });
    });
});
