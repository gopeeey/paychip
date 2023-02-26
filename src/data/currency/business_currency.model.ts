import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "sequelize";
import { BusinessCurrencyModelInterface, CurrencyModelInterface } from "@logic/currency";
import { BusinessModelInterface } from "@logic/business";
import { db } from "../db";

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
