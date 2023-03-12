import { ChargesRepoInterface } from "@logic/charges/interfaces/charges_repo.interface";
import { Transaction } from "sequelize";
import { generateId } from "src/utils";
import { ChargeStack } from "./charge_stack.model";

type Dependencies = {
    chargeStackModel: typeof ChargeStack;
};

export class ChargesRepo implements ChargesRepoInterface {
    constructor(_deps: Dependencies) {}

    createChargeStack: ChargesRepoInterface["createChargeStack"] = async (
        createChargeStackDto,
        session
    ) => {
        const chargeStack = await ChargeStack.create(
            { ...createChargeStackDto, id: generateId() },
            { transaction: session as Transaction }
        );
        return chargeStack.toJSON();
    };
}
