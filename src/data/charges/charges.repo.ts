import { ChargesRepoInterface } from "@logic/charges/interfaces/charges_repo.interface";
import { Transaction, Op } from "sequelize";
import { generateId } from "src/utils";
import { WalletChargeStack } from "../charges";
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
}