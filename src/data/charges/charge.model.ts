import { ChargeModelInterface } from "@logic/charges";
import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { db } from "..";

export class Charge
    extends Model<InferAttributes<Charge>, InferCreationAttributes<Charge>>
    implements ChargeModelInterface
{
    declare id: ChargeModelInterface["id"];
    declare businessId: ForeignKey<ChargeModelInterface["businessId"]>;
    declare name: ChargeModelInterface["name"];
    declare flatCharge: ChargeModelInterface["flatCharge"];
    declare percentageCharge: ChargeModelInterface["percentageCharge"];
    declare percentageChargeCap: ChargeModelInterface["percentageChargeCap"];
    declare minimumPrincipalAmount: ChargeModelInterface["minimumPrincipalAmount"];

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
}

Charge.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        flatCharge: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        percentageCharge: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        percentageChargeCap: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        minimumPrincipalAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    { sequelize: db, modelName: "charge" }
);
