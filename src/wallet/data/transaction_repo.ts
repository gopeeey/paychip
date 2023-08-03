import { TransactionModelInterface, TransactionRepoInterface } from "@wallet/logic";
import { generateId } from "src/utils";
import { PgBaseRepo } from "@db/postgres";
import { Pool } from "pg";
import * as queries from "./transaction_queries";
import { runQuery } from "@db/postgres";
import { PgSession } from "@db/postgres";
import { SessionInterface } from "@bases/logic";

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

    getByRefAndStatus: TransactionRepoInterface["getByRefAndStatus"] = async (
        reference,
        status,
        session
    ) => {
        const query = queries.getByRefAndStatusQuery(reference, status);
        const res = await runQuery<TransactionModelInterface>(
            query,
            this._pool,
            (session as PgSession)?.client
        );
        const transaction = res.rows[0];
        return transaction || null;
    };

    updateReference: TransactionRepoInterface["updateReference"] = async (
        transactionId,
        reference,
        session
    ) => {
        const query = queries.updateReferenceQuery(transactionId, reference);
        await runQuery(query, this._pool, (session as PgSession)?.client);
    };

    updateTransactionInfo: TransactionRepoInterface["updateTransactionInfo"] = async (
        transactionId,
        data,
        session
    ) => {
        const query = queries.updateTransactionInfo(transactionId, data);
        await runQuery(query, this._pool, (session as PgSession)?.client);
    };
}
