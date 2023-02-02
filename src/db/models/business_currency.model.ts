import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
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
