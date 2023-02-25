import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
    UUIDV4,
    NonAttribute,
} from "sequelize";
import { db } from "../db";
import { AccountModelInterface } from "@logic/account";
import { BusinessModelInterface } from "@logic/business";

export class Account
    extends Model<InferAttributes<Account>, InferCreationAttributes<Account>>
    implements AccountModelInterface
{
    declare id: CreationOptional<string>;
    declare name: string;
    declare email: string;
    declare password: string;
    declare businesses?: NonAttribute<BusinessModelInterface[]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
}

Account.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: UUIDV4,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(300),
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    { sequelize: db, paranoid: true, modelName: "accounts" }
);
