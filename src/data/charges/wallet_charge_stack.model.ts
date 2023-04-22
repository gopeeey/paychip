import {
    allowedChargeTypes,
    ChargeStackModelInterface,
    WalletChargeStackModelInterface,
} from "@logic/charges";
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    DataTypes,
    CreationOptional,
    ForeignKey,
} from "sequelize";
import { db } from "../db_old";

export class WalletChargeStack
    extends Model<InferAttributes<WalletChargeStack>, InferCreationAttributes<WalletChargeStack>>
    implements WalletChargeStackModelInterface
{
    declare id: WalletChargeStackModelInterface["id"];
    declare walletId: ForeignKey<WalletChargeStackModelInterface["walletId"]>;
    declare chargeStackId: ForeignKey<ChargeStackModelInterface["id"]>;
    declare chargeType: WalletChargeStackModelInterface["chargeType"];

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
}

WalletChargeStack.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        chargeType: { type: DataTypes.ENUM(...allowedChargeTypes), allowNull: false },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    { sequelize: db, modelName: "wallet_charge_stacks" }
);
