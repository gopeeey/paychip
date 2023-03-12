import { Business } from "@data/business";
import { ChargeStack } from "@data/charges";
import { ChargesRepo } from "@data/charges/charges.repo";
import { StartSequelizeSession } from "@data/sequelize_session";
import { CreateChargeStackDto } from "@logic/charges";
import { chargesSeeder } from "src/__tests__/samples/charges.samples";
import { DBSetup, SeedingError } from "src/__tests__/test_utils";

DBSetup(chargesSeeder);

const chargesRepo = new ChargesRepo({ chargeStackModel: ChargeStack });

describe("TESTING CHARGES REPO", () => {
    describe("Testing createChargeStack", () => {
        it("should persist and return a charge stack object", async () => {
            const session = await StartSequelizeSession();
            const business = await Business.findOne();
            if (!business) throw new SeedingError("business not found");
            const data = new CreateChargeStackDto({
                businessId: business.id,
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
});
