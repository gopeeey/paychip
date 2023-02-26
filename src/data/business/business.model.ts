import { BusinessModelInterface } from "@logic/business";
import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
    NonAttribute,
} from "sequelize";
import { db } from "../db";

export class Business
    extends Model<InferAttributes<Business>, InferCreationAttributes<Business>>
    implements BusinessModelInterface
{
    declare id: CreationOptional<number>;
    declare name: string;
    declare ownerId: ForeignKey<BusinessModelInterface["ownerId"]>;
    declare owner?: NonAttribute<BusinessModelInterface["owner"]>;
    declare countryCode: ForeignKey<BusinessModelInterface["countryCode"]>;
    declare country?: NonAttribute<BusinessModelInterface["country"]>;
    declare customers?: NonAttribute<BusinessModelInterface["customers"]>;
    declare currencies?: NonAttribute<BusinessModelInterface["currencies"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
}

Business.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    { sequelize: db, paranoid: true, modelName: "businesses" }
);
