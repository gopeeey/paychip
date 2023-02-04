import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "sequelize";
import {
    BusinessCurrencyModelInterface,
    BusinessModelInterface,
    CurrencyModelInterface,
} from "../../contracts/interfaces";
import db from "..";

export class BusinessCurrency
    extends Model<InferAttributes<BusinessCurrency>, InferCreationAttributes<BusinessCurrency>>
    implements BusinessCurrencyModelInterface
{
    declare businessId: BusinessModelInterface["id"];
    declare currencyIsoCode: CurrencyModelInterface["isoCode"];
    declare business?: NonAttribute<BusinessModelInterface>;
    declare currency?: NonAttribute<CurrencyModelInterface>;
}

BusinessCurrency.init(
    {
        businessId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        currencyIsoCode: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
    },
    { sequelize: db, paranoid: true, modelName: "businessCurrencies" }
);
