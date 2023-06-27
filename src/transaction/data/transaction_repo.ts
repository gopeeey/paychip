import { TransactionModelInterface, TransactionRepoInterface } from "@transaction/logic";
import { generateId } from "src/utils";
import { PgBaseRepo } from "@db/postgres";
import { Pool } from "pg";
import * as queries from "./queries";
import { runQuery } from "@db/postgres";
import { PgSession } from "@db/postgres";

export class TransactionRepo extends PgBaseRepo implements TransactionRepoInterface {
    constructor(private readonly _pool: Pool) {
        super(_pool);
    }

    create: TransactionRepoInterface["create"] = async (createDto, session) => {
        const query = queries.createTransactionQuery({
            ...createDto,
            id: generateId(createDto.businessId),
        });

        const res = await runQuery<TransactionModelInterface>(
            query,
            this._pool,
            (session as PgSession)?.client
        );
        return res.rows[0];
    };

    getByReference: TransactionRepoInterface["getByReference"] = async (reference, session) => {
        const query = queries.getByReferenceQuery(reference);
        const res = await runQuery<TransactionModelInterface>(
            query,
            this._pool,
            (session as PgSession)?.client
        );
        const transaction = res.rows[0];
        return transaction ? transaction : null;
    };

    updateStatus: TransactionRepoInterface["updateStatus"] = async (
        transactionId,
        status,
        session
    ) => {
        const query = queries.updateStatusQuery(transactionId, status);
        await runQuery(query, this._pool, (session as PgSession)?.client);
    };
}
