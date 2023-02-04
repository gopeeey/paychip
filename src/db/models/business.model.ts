import {
    BusinessModelInterface,
    AccountModelInterface,
    CountryModelInterface,
    CustomerModelInterface,
} from "../../contracts/interfaces";
import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
    NonAttribute,
} from "sequelize";
import db from "..";

export class Business
    extends Model<InferAttributes<Business>, InferCreationAttributes<Business>>
    implements BusinessModelInterface
{
    declare id: CreationOptional<number>;
    declare name: string;
    declare ownerId: ForeignKey<AccountModelInterface["id"]>;
    declare owner?: NonAttribute<AccountModelInterface>;
    declare countryCode: ForeignKey<CountryModelInterface["isoCode"]>;
    declare country?: NonAttribute<CountryModelInterface>;
    declare customers?: NonAttribute<CustomerModelInterface[]>;

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
