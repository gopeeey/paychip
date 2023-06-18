import {
    CurrencyDto,
    CurrencyModelInterface,
    CurrencyModelInterfaceDef,
    CurrencyRepoInterface,
} from "@currency/logic";
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

    parseCurrency = (data: DbCurrency) => {
        let { fundingCs, withdrawalCs, walletInCs, walletOutCs } = data;

        return new CurrencyDto({
            ...data,
            fundingCs: JSON.parse(fundingCs),
            withdrawalCs: JSON.parse(withdrawalCs),
            walletInCs: JSON.parse(walletInCs),
            walletOutCs: JSON.parse(walletOutCs),
        });
    };

    getAll: CurrencyRepoInterface["getAll"] = async () => {
        const query = queries.getAllQuery();
        const res = await runQuery<DbCurrency>(query, this._pool);
        return res.rows.map((row) => this.parseCurrency(row));
    };

    getActive: CurrencyRepoInterface["getActive"] = async () => {
        const query = queries.getActiveQuery();
        const res = await runQuery<DbCurrency>(query, this._pool);
        return res.rows.map((row) => this.parseCurrency(row));
    };

    getByIsoCode: CurrencyRepoInterface["getByIsoCode"] = async (isoCode) => {
        const query = queries.getByIsoCode(isoCode);
        const res = await runQuery<DbCurrency>(query, this._pool);
        const currency = res.rows[0];
        return currency ? this.parseCurrency(currency) : null;
    };
}
