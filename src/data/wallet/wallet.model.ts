import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "sequelize";
import { db } from "../db";
import { WalletModelInterface } from "@logic/wallet";

export class Wallet
    extends Model<InferAttributes<Wallet>, InferCreationAttributes<Wallet>>
    implements WalletModelInterface
{
    declare id: CreationOptional<WalletModelInterface["id"]>;
    declare businessId: ForeignKey<WalletModelInterface["businessId"]>;
    declare business?: NonAttribute<WalletModelInterface["business"]>;
    declare parentWalletId: ForeignKey<WalletModelInterface["id"] | null>;
    declare parentWallet?: NonAttribute<WalletModelInterface>;
    declare currency: ForeignKey<WalletModelInterface["currency"]>;
    declare balance: CreationOptional<WalletModelInterface["balance"]>;
    declare waiveFundingCharges: WalletModelInterface["waiveFundingCharges"];
    declare waiveWithdrawalCharges: WalletModelInterface["waiveWithdrawalCharges"];
    declare email: WalletModelInterface["email"];
    declare chargeSchemeId: ForeignKey<WalletModelInterface["chargeSchemeId"]>;
    declare chargeScheme?: NonAttribute<WalletModelInterface["chargeScheme"]>;
    declare walletType: WalletModelInterface["walletType"];
}

Wallet.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        currency: { type: DataTypes.STRING(10), allowNull: false },
        balance: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
        waiveFundingCharges: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        waiveWithdrawalCharges: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        email: { type: DataTypes.STRING(150), allowNull: false },
        walletType: { type: DataTypes.STRING(25), allowNull: false },
    },
    { sequelize: db, paranoid: true, modelName: "wallets" }
);
