import { Pool } from "pg";
import { CountryModelInterface, CountryRepoInterface, CreateCountryDto } from "@country/logic";
import { runQuery } from "@db/postgres";
import * as queries from "./queries";

export class CountryRepo implements CountryRepoInterface {
    constructor(private readonly _pool: Pool) {}

    create = async (createCountryDto: CreateCountryDto) => {
        const res = await runQuery<CountryModelInterface>(
            queries.createQuery(createCountryDto),
            this._pool
        );
        return res.rows[0];
    };

    getByCode = async (code: CountryModelInterface["isoCode"]) => {
        const res = await runQuery<CountryModelInterface>(queries.getByCodeQuery(code), this._pool);
        return res.rows[0] || null;
    };

    getAll = async () => {
        const res = await runQuery<CountryModelInterface>(queries.getAllQuery(), this._pool);
        return res.rows;
    };
}
