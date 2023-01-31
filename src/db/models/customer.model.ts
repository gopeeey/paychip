import { CustomerModelInterface } from "../../contracts/interfaces";
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from "sequelize";
import db from "..";

export class Customer
    extends Model<InferAttributes<Customer>, InferCreationAttributes<Customer>>
    implements CustomerModelInterface
{
    declare id: CreationOptional<string>;
    declare businessId: string;
    declare name: string;
    declare email: string;
    declare phone?: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
}

Customer.init(
    {
        id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        businessId: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(30),
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    { sequelize: db, paranoid: true, modelName: "customers" }
);
