import { allowedPaidBy, ChargeStackModelInterface } from "@logic/charges";
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
    ForeignKey,
    NonAttribute,
} from "sequelize";
import { db } from "..";

export class ChargeStack
    extends Model<InferAttributes<ChargeStack>, InferCreationAttributes<ChargeStack>>
    implements ChargeStackModelInterface
{
    declare id: ChargeStackModelInterface["id"];
    declare businessId: ForeignKey<ChargeStackModelInterface["businessId"]>;
    declare business?: NonAttribute<ChargeStackModelInterface["business"]>;
    declare name: ChargeStackModelInterface["name"];
    declare description: ChargeStackModelInterface["description"];
    declare paidBy: ChargeStackModelInterface["paidBy"];

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
}

ChargeStack.init(
    {
        id: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true,
            allowNull: false,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING },
        paidBy: { type: DataTypes.ENUM(...allowedPaidBy), allowNull: true },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    { sequelize: db, modelName: "charge_stacks" }
);
