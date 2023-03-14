import { allowedTransactionTypes, TransactionModelInterface } from "@logic/transaction";
import { allowedPaidBy, PaidByType } from "@logic/charges";
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute,
    ForeignKey,
    DataTypes,
} from "sequelize";
import { db } from "../db";

export class Transaction
    extends Model<InferAttributes<Transaction>, InferCreationAttributes<Transaction>>
    implements TransactionModelInterface
{
    declare id: TransactionModelInterface["id"];
    declare walletId: ForeignKey<TransactionModelInterface["walletId"]>;
    declare customerId: ForeignKey<TransactionModelInterface["customerId"]>;
    declare customer?: NonAttribute<TransactionModelInterface["customer"]>;
    declare transactionType: TransactionModelInterface["transactionType"];
    declare channel: TransactionModelInterface["channel"];
    declare amount: TransactionModelInterface["amount"];
    declare settledAmount: TransactionModelInterface["settledAmount"];
    declare charge: TransactionModelInterface["charge"];
    declare chargePaidBy: TransactionModelInterface["chargePaidBy"];
    declare provider?: TransactionModelInterface["provider"];
    declare providerRef?: TransactionModelInterface["providerRef"];
    declare bankName?: TransactionModelInterface["bankName"];
    declare accountName?: TransactionModelInterface["accountName"];
    declare cardNumber?: TransactionModelInterface["cardNumber"];
    declare cardType?: TransactionModelInterface["cardType"];
    declare senderWalletId?: ForeignKey<TransactionModelInterface["senderWalletId"]>;
    declare receiverWalletId?: ForeignKey<TransactionModelInterface["receiverWalletId"]>;
}

Transaction.init(
    {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        transactionType: {
            type: DataTypes.ENUM(...allowedTransactionTypes),
            allowNull: false,
        },
        channel: { type: DataTypes.STRING, allowNull: false },
        amount: { type: DataTypes.INTEGER, allowNull: false },
        settledAmount: { type: DataTypes.INTEGER, allowNull: false },
        charge: { type: DataTypes.INTEGER, allowNull: false },
        chargePaidBy: {
            type: DataTypes.ENUM(...allowedPaidBy),
            allowNull: false,
        },
        provider: { type: DataTypes.STRING },
        providerRef: { type: DataTypes.STRING },
        bankName: { type: DataTypes.STRING },
        accountName: { type: DataTypes.STRING },
        cardNumber: { type: DataTypes.STRING },
        cardType: { type: DataTypes.STRING },
    },
    { sequelize: db, paranoid: true, modelName: "transactions" }
);
