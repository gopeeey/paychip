import { ChargeStackNotFoundError } from "@logic/charges";
import { ChargesRepoInterface } from "@logic/charges/interfaces/charges_repo.interface";
import { Transaction, Op } from "sequelize";
import { generateId } from "src/utils";
import { Charge, ChargeStackCharge, WalletChargeStack, ChargeStack } from "../charges";

export class ChargesRepo implements ChargesRepoInterface {
    createChargeStack: ChargesRepoInterface["createChargeStack"] = async (
        createChargeStackDto,
        session
    ) => {
        const chargeStack = await ChargeStack.create(
            { ...createChargeStackDto, id: generateId(createChargeStackDto.businessId) },
            { transaction: session as Transaction }
        );
        return chargeStack.toJSON();
    };

    addStackToWallet: ChargesRepoInterface["addStackToWallet"] = async (addStackDto) => {
        await WalletChargeStack.destroy({
            where: {
                [Op.and]: {
                    walletId: addStackDto.walletId,
                    chargeStackType: addStackDto.chargeStackType,
                },
            },
        });
        await WalletChargeStack.create({ ...addStackDto, id: generateId() });
    };

    createCharge: ChargesRepoInterface["createCharge"] = async (createChargeDto) => {
        const charge = await Charge.create({
            ...createChargeDto,
            id: generateId(createChargeDto.businessId),
        });
        return charge.toJSON();
    };

    getStackById: ChargesRepoInterface["getStackById"] = async (stackId) => {
        const chargeStack = await ChargeStack.findByPk(stackId, { include: "charges" });
        if (!chargeStack) throw new ChargeStackNotFoundError();
        return chargeStack.toJSON();
    };

    addChargesToStack: ChargesRepoInterface["addChargesToStack"] = async ({
        chargeIds,
        stackId,
    }) => {
        await this.getStackById(stackId);
        await ChargeStackCharge.bulkCreate(
            chargeIds.map((chargeId) => ({ chargeId, chargeStackId: stackId }))
        );

        return await this.getStackById(stackId);
    };
}
