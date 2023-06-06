import { TransactionModelInterface, TransactionRepoInterface } from "@logic/transaction";
import { generateId } from "src/utils";
import { PgBaseRepo } from "@data/pg_base_repo";
import { Pool } from "pg";
import * as queries from "./queries";
import { runQuery } from "@data/db";

export class TransactionRepo extends PgBaseRepo implements TransactionRepoInterface {
    constructor(private readonly _pool: Pool) {
        super(_pool);
    }

    create: TransactionRepoInterface["create"] = async (createDto, session) => {
        const query = queries.createTransactionQuery({
            ...createDto,
            id: generateId(createDto.businessId),
        });

        const res = await runQuery<TransactionModelInterface>(query, this._pool);
        return res.rows[0];
    };
}
