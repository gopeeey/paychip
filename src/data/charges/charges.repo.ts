import { ChargeStackNotFoundError } from "@logic/charges";
import { ChargesRepoInterface } from "@logic/charges/interfaces/charges_repo.interface";
import { Transaction, Op } from "sequelize";
import { generateId } from "src/utils";
import { Charge, ChargeStackCharge, WalletChargeStack } from "../charges";
import { ChargeStack } from "./charge_stack.model";

type Dependencies = {
    chargeStackModel: typeof ChargeStack;
    walletChargeStackModel: typeof WalletChargeStack;
};

export class ChargesRepo implements ChargesRepoInterface {
    chargeStackModel: Dependencies["chargeStackModel"];
    walletChargeStackModel: Dependencies["walletChargeStackModel"];

    constructor(private readonly _deps: Dependencies) {
        this.chargeStackModel = this._deps.chargeStackModel;
        this.walletChargeStackModel = this._deps.walletChargeStackModel;
    }

    createChargeStack: ChargesRepoInterface["createChargeStack"] = async (
        createChargeStackDto,
        session
    ) => {
        const chargeStack = await this._deps.chargeStackModel.create(
            { ...createChargeStackDto, id: generateId() },
            { transaction: session as Transaction }
        );
        return chargeStack.toJSON();
    };

    addStackToWallet: ChargesRepoInterface["addStackToWallet"] = async (addStackDto) => {
        await this.walletChargeStackModel.destroy({
            where: {
                [Op.and]: {
                    walletId: addStackDto.walletId,
                    chargeStackType: addStackDto.chargeStackType,
                },
            },
        });
        await this._deps.walletChargeStackModel.create({ ...addStackDto, id: generateId() });
    };

    createCharge: ChargesRepoInterface["createCharge"] = async (createChargeDto) => {
        const charge = await Charge.create({ ...createChargeDto, id: generateId() });
        return charge.toJSON();
    };

    getStackById: ChargesRepoInterface["getStackById"] = async (stackId) => {
        const chargeStack = await ChargeStack.findByPk(stackId, { include: "charges" });
        if (!chargeStack) throw new ChargeStackNotFoundError();
        return chargeStack.toJSON();
    };

    addChargesToStack: ChargesRepoInterface["addChargesToStack"] = async (chargeIds, stackId) => {
        const stack = await this.getStackById(stackId);
        await ChargeStackCharge.bulkCreate(
            chargeIds.map((chargeId) => ({ chargeId, chargeStackId: stackId }))
        );

        return stack;
    };
}
