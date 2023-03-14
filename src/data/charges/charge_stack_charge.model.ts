import { ChargeStackChargeModelInterface } from "@logic/charges";
import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { db } from "..";

export class ChargeStackCharge
    extends Model<InferAttributes<ChargeStackCharge>, InferCreationAttributes<ChargeStackCharge>>
    implements ChargeStackChargeModelInterface
{
    declare id: CreationOptional<ChargeStackChargeModelInterface["id"]>;
    declare chargeId: ForeignKey<ChargeStackChargeModelInterface["chargeId"]>;
    declare chargeStackId: ForeignKey<ChargeStackChargeModelInterface["chargeStackId"]>;
}

ChargeStackCharge.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
    },
    { sequelize: db, modelName: "charge_stack_charges" }
);
