import { CurrencyModelInterface, CurrencyRepoInterface } from "@logic/currency";
import { Pool } from "pg";
import { runQuery } from "@data/db";
import * as queries from "./queries";

export class CurrencyRepo implements CurrencyRepoInterface {
    constructor(private readonly _pool: Pool) {}

    getAll: CurrencyRepoInterface["getAll"] = async () => {
        const query = queries.getAllQuery();
        const res = await runQuery<CurrencyModelInterface>(query, this._pool);
        return res.rows;
    };

    getActive: CurrencyRepoInterface["getActive"] = async () => {
        const query = queries.getActiveQuery();
        const res = await runQuery<CurrencyModelInterface>(query, this._pool);
        return res.rows;
    };
}
