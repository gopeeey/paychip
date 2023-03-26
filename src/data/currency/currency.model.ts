import { CountryModelInterface } from "@logic/country";
import { CurrencyModelInterface } from "@logic/currency";
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
    NonAttribute,
} from "sequelize";
import { db } from "../db";

export class Currency
    extends Model<InferAttributes<Currency>, InferCreationAttributes<Currency>>
    implements CurrencyModelInterface
{
    declare isoCode: string;
    declare name: string;
    declare countries?: NonAttribute<CountryModelInterface[]>;
    declare fundingCs: CurrencyModelInterface["fundingCs"];
    declare withdrawalCs: CurrencyModelInterface["withdrawalCs"];
    declare walletInCs: CurrencyModelInterface["walletInCs"];
    declare walletOutCs: CurrencyModelInterface["walletOutCs"];

    declare createdAt?: CreationOptional<Date>;
    declare updatedAt?: CreationOptional<Date>;
    declare deletedAt?: CreationOptional<Date | null>;
}

Currency.init(
    {
        isoCode: {
            type: DataTypes.STRING(9),
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        fundingCs: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        withdrawalCs: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        walletInCs: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        walletOutCs: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    { sequelize: db, paranoid: true, modelName: "currencies" }
);
