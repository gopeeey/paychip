import { BusinessModelInterface, CustomerModelInterface } from "../../contracts/interfaces";
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
    NonAttribute,
} from "sequelize";
import db from "..";

export class Customer
    extends Model<InferAttributes<Customer>, InferCreationAttributes<Customer>>
    implements CustomerModelInterface
{
    declare id: CreationOptional<CustomerModelInterface["id"]>;
    declare businessId: CustomerModelInterface["businessId"];
    declare business?: NonAttribute<BusinessModelInterface>;
    declare name: CustomerModelInterface["name"];
    declare email: CustomerModelInterface["email"];
    declare phone?: CustomerModelInterface["phone"];

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
            type: DataTypes.INTEGER,
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
