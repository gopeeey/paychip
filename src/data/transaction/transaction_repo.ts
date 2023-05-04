import {
    CreateTransactionDto,
    TransactionModelInterface,
    TransactionRepoInterface,
} from "@logic/transaction";
import { generateId } from "src/utils";
import { Transaction } from "./transaction.model";
import { Transaction as SequelizeTransaction } from "sequelize";
import { PgBaseRepo } from "@data/pg_base_repo";
import { Pool } from "pg";
import * as queries from "./queries";
import SQL from "sql-template-strings";
import { runQuery } from "@data/db";
import { transactionJson, transactionObj } from "src/__tests__/samples";

export class TransactionRepo extends PgBaseRepo implements TransactionRepoInterface {
    constructor(private readonly __pool: Pool) {
        super(__pool);
    }

    create: TransactionRepoInterface["create"] = async (createDto, session) => {
        const query = queries.createTransactionQuery({
            ...createDto,
            id: generateId(createDto.businessId),
        });

        const res = await runQuery<TransactionModelInterface>(query, this.__pool);
        return res.rows[0];
    };
}
