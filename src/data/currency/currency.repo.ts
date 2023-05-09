import {
    CurrencyModelInterface,
    CurrencyModelInterfaceDef,
    CurrencyRepoInterface,
} from "@logic/currency";
import { Pool } from "pg";
import { runQuery } from "@data/db";
import * as queries from "./queries";

export interface DbCurrency
    extends Omit<
        CurrencyModelInterfaceDef,
        "fundingCs" | "withdrawalCs" | "walletInCs" | "walletOutCs"
    > {
    fundingCs: string;
    withdrawalCs: string;
    walletInCs: string;
    walletOutCs: string;
}

export class CurrencyRepo implements CurrencyRepoInterface {
    constructor(private readonly _pool: Pool) {}

    parseCurrency = async (data: DbCurrency) => {
        let { fundingCs, withdrawalCs, walletInCs, walletOutCs } = data;
        fundingCs = JSON.parse(fundingCs);
    };

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
