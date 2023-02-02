import { CurrencyModelInterface } from "../../contracts/interfaces";
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from "sequelize";
import db from "..";

export class Currency
    extends Model<InferAttributes<Currency>, InferCreationAttributes<Currency>>
    implements CurrencyModelInterface
{
    declare isoCode: string;
    declare name: string;

    declare createdAt?: CreationOptional<Date>;
    declare updatedAt?: CreationOptional<Date>;
    declare deletedAt?: CreationOptional<Date | null>;
}

Currency.init(
    {
        isoCode: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    { sequelize: db, paranoid: true, modelName: "currencies" }
);
