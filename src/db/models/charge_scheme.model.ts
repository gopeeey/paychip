import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "sequelize";
import db from "..";
import { ChargeSchemeModelInterface } from "../../contracts/interfaces";

export class ChargeScheme
    extends Model<InferAttributes<ChargeScheme>, InferCreationAttributes<ChargeScheme>>
    implements ChargeSchemeModelInterface
{
    declare id: CreationOptional<ChargeSchemeModelInterface["id"]>;
    declare businessId: ForeignKey<ChargeSchemeModelInterface["businessId"]>;
    declare business?: NonAttribute<ChargeSchemeModelInterface["business"]>;
    declare name: ChargeSchemeModelInterface["name"];
    declare description: ChargeSchemeModelInterface["description"];
    declare currency: ForeignKey<ChargeSchemeModelInterface["currency"]>;
    declare transactionType: ChargeSchemeModelInterface["transactionType"];
    declare primary: ChargeSchemeModelInterface["primary"];
    declare flatCharge: ChargeSchemeModelInterface["flatCharge"];
    declare percentageCharge: ChargeSchemeModelInterface["percentageCharge"];
    declare percentageChargeCap: ChargeSchemeModelInterface["percentageChargeCap"];
    declare minimumPrincipalAmount: ChargeSchemeModelInterface["minimumPrincipalAmount"];

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
}

ChargeScheme.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING },
        transactionType: { type: DataTypes.STRING, allowNull: false },
        primary: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
        flatCharge: { type: DataTypes.NUMBER, defaultValue: 0, allowNull: false },
        percentageCharge: { type: DataTypes.NUMBER, defaultValue: 0, allowNull: false },
        percentageChargeCap: { type: DataTypes.NUMBER, defaultValue: 0, allowNull: false },
        minimumPrincipalAmount: { type: DataTypes.NUMBER, defaultValue: 0, allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    { sequelize: db, paranoid: true, modelName: "chargeSchemes" }
);
