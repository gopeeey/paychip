import { WalletModelInterface, WalletRepoInterface } from "@wallet/logic";
import { generateId } from "src/utils";
import { Pool } from "pg";
import { PgBaseRepo } from "@data/pg_base_repo";
import * as queries from "./queries";
import { runQuery } from "@data/db";
import { PgSession } from "@data/pg_session";

export class WalletRepo extends PgBaseRepo implements WalletRepoInterface {
    constructor(private readonly _pool: Pool) {
        super(_pool);
    }

    create: WalletRepoInterface["create"] = async (createWalletDto, session) => {
        const query = queries.createWalletQuery({
            ...createWalletDto,
            id: generateId(createWalletDto.businessId),
        });

        const res = await runQuery<WalletModelInterface>(
            query,
            this._pool,
            (session as PgSession)?.client
        );
        const wallet = res.rows[0];
        return wallet;
    };

    getById = async (id: WalletModelInterface["id"]) => {
        const res = await runQuery<WalletModelInterface>(queries.getByIdQuery(id), this._pool);
        const wallet = res.rows[0];
        return wallet || null;
    };

    getUnique: WalletRepoInterface["getUnique"] = async (getUniqueDto) => {
        const res = await runQuery<WalletModelInterface>(
            queries.getUniqueQuery(getUniqueDto),
            this._pool
        );
        const wallet = res.rows[0];
        return wallet || null;
    };

    incrementBalance: WalletRepoInterface["incrementBalance"] = async (incrementBalanceDto) => {
        await runQuery<WalletModelInterface>(
            queries.incrementBalanceQuery(incrementBalanceDto),
            this._pool,
            (incrementBalanceDto.session as PgSession)?.client
        );
    };
}
