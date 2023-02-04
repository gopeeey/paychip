import {
    Model,
    InferCreationAttributes,
    InferAttributes,
    DataTypes,
    CreationOptional,
    NonAttribute,
} from "sequelize";
import db from "..";
import { BusinessModelInterface, CountryModelInterface } from "../../contracts/interfaces";

export class Country
    extends Model<InferAttributes<Country>, InferCreationAttributes<Country>>
    implements CountryModelInterface
{
    declare isoCode: string;
    declare name: string;
    declare businesses?: NonAttribute<BusinessModelInterface[]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
}

Country.init(
    {
        isoCode: {
            type: DataTypes.CHAR(4),
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    { sequelize: db, paranoid: true, modelName: "countries" }
);
