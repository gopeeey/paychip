import {
    CreateTransactionDto,
    TransactionModelInterface,
    TransactionRepoInterface,
} from "@logic/transaction";
import { generateId } from "src/utils";
import { Transaction } from "./transaction.model";
import { Transaction as SequelizeTransaction } from "sequelize";

export class TransactionRepo implements TransactionRepoInterface {
    create: TransactionRepoInterface["create"] = async (createDto, session) => {
        const transaction = await Transaction.create(
            { ...createDto, id: generateId(createDto.businessId) },
            { transaction: session as SequelizeTransaction }
        );

        return transaction.toJSON();
    };
}
