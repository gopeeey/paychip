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
    declare email: WalletModelInterface["email"];
    declare walletType: WalletModelInterface["walletType"];
    declare waiveFundingCharges: WalletModelInterface["waiveFundingCharges"];
    declare waiveWithdrawalCharges: WalletModelInterface["waiveWithdrawalCharges"];
    declare waiveWalletInCharges: WalletModelInterface["waiveWalletInCharges"];
    declare waiveWalletOutCharges: WalletModelInterface["waiveWalletOutCharges"];
}

Wallet.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        balance: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        email: { type: DataTypes.STRING(150), allowNull: false },
        walletType: { type: DataTypes.STRING(25), allowNull: false },
        waiveFundingCharges: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        waiveWithdrawalCharges: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        waiveWalletInCharges: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        waiveWalletOutCharges: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { sequelize: db, paranoid: true, modelName: "wallets" }
);
