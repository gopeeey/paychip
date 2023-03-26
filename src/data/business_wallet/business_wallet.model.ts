import { BusinessWalletModelInterface } from "@logic/business_wallet";
import { allowedPaidBy } from "@logic/index";
import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { db } from "..";

export class BusinessWallet
    extends Model<InferAttributes<BusinessWallet>, InferCreationAttributes<BusinessWallet>>
    implements BusinessWalletModelInterface
{
    declare id: CreationOptional<BusinessWalletModelInterface["id"]>;
    declare businessId: ForeignKey<BusinessWalletModelInterface["businessId"]>;
    declare currencyCode: ForeignKey<BusinessWalletModelInterface["currencyCode"]>;
    declare balance: BusinessWalletModelInterface["balance"];
    declare customFundingCs: BusinessWalletModelInterface["customFundingCs"];
    declare customWithdrawalCs: BusinessWalletModelInterface["customWithdrawalCs"];
    declare customWalletInCs: BusinessWalletModelInterface["customWalletInCs"];
    declare customWalletOutCs: BusinessWalletModelInterface["customWalletOutCs"];
    declare fundingChargesPaidBy: BusinessWalletModelInterface["fundingChargesPaidBy"];
    declare withdrawalChargesPaidBy: BusinessWalletModelInterface["withdrawalChargesPaidBy"];
    declare w_fundingCs: BusinessWalletModelInterface["w_fundingCs"];
    declare w_withdrawalCs: BusinessWalletModelInterface["w_withdrawalCs"];
    declare w_walletInCs: BusinessWalletModelInterface["w_walletInCs"];
    declare w_walletOutCs: BusinessWalletModelInterface["w_walletOutCs"];
    declare w_fundingChargesPaidBy: BusinessWalletModelInterface["w_fundingChargesPaidBy"];
    declare w_withdrawalChargesPaidBy: BusinessWalletModelInterface["w_withdrawalChargesPaidBy"];

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
}

BusinessWallet.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        balance: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
        customFundingCs: { type: DataTypes.STRING, defaultValue: "[]", allowNull: false },
        customWithdrawalCs: { type: DataTypes.STRING, defaultValue: "[]", allowNull: false },
        customWalletInCs: { type: DataTypes.STRING, defaultValue: "[]", allowNull: false },
        customWalletOutCs: { type: DataTypes.STRING, defaultValue: "[]", allowNull: false },
        fundingChargesPaidBy: {
            type: DataTypes.ENUM(...allowedPaidBy),
            allowNull: false,
            defaultValue: "wallet",
        },
        withdrawalChargesPaidBy: {
            type: DataTypes.ENUM(...allowedPaidBy),
            allowNull: false,
            defaultValue: "wallet",
        },
        w_fundingCs: { type: DataTypes.STRING, defaultValue: "[]", allowNull: false },
        w_withdrawalCs: { type: DataTypes.STRING, defaultValue: "[]", allowNull: false },
        w_walletInCs: { type: DataTypes.STRING, defaultValue: "[]", allowNull: false },
        w_walletOutCs: { type: DataTypes.STRING, defaultValue: "[]", allowNull: false },
        w_fundingChargesPaidBy: {
            type: DataTypes.ENUM(...allowedPaidBy),
            allowNull: false,
            defaultValue: "wallet",
        },
        w_withdrawalChargesPaidBy: {
            type: DataTypes.ENUM(...allowedPaidBy),
            allowNull: false,
            defaultValue: "wallet",
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    { sequelize: db, paranoid: true, modelName: "business_wallets" }
);
