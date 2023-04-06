import {
    allowedStatuses,
    allowedTransactionTypes,
    TransactionModelInterface,
} from "@logic/transaction";
import { allowedPaidBy } from "@logic/charges";
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute,
    ForeignKey,
    DataTypes,
} from "sequelize";
import { db } from "@data/db_old";

export class Transaction
    extends Model<InferAttributes<Transaction>, InferCreationAttributes<Transaction>>
    implements TransactionModelInterface
{
    declare id: TransactionModelInterface["id"];
    declare walletId: ForeignKey<TransactionModelInterface["walletId"]>;
    declare customerId: ForeignKey<TransactionModelInterface["customerId"]>;
    declare businessId: ForeignKey<TransactionModelInterface["businessId"]>;
    declare customer?: NonAttribute<TransactionModelInterface["customer"]>;
    declare transactionType: TransactionModelInterface["transactionType"];
    declare status: TransactionModelInterface["status"];
    declare channel: TransactionModelInterface["channel"];
    declare amount: TransactionModelInterface["amount"];
    declare settledAmount: TransactionModelInterface["settledAmount"];
    declare charge: TransactionModelInterface["charge"];
    declare chargePaidBy: TransactionModelInterface["chargePaidBy"];
    declare provider?: TransactionModelInterface["provider"];
    declare providerRef?: TransactionModelInterface["providerRef"];
    declare bankName?: TransactionModelInterface["bankName"];
    declare bankCode?: TransactionModelInterface["bankCode"];
    declare accountName?: TransactionModelInterface["accountName"];
    declare accountNumber?: TransactionModelInterface["accountNumber"];
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
        status: {
            type: DataTypes.ENUM(...allowedStatuses),
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
        bankCode: { type: DataTypes.STRING },
        accountName: { type: DataTypes.STRING },
        accountNumber: { type: DataTypes.STRING },
        cardNumber: { type: DataTypes.STRING },
        cardType: { type: DataTypes.STRING },
        senderWalletId: { type: DataTypes.STRING },
        receiverWalletId: { type: DataTypes.STRING },
    },
    { sequelize: db, paranoid: true, modelName: "transactions" }
);
