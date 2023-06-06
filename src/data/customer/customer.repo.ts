import { CustomerModelInterface, CustomerRepoInterface } from "@logic/customer";
import { generateId } from "src/utils";
import { PgBaseRepo } from "@data/pg_base_repo";
import { Pool } from "pg";
import { runQuery } from "@data/db";
import * as queries from "./queries";
import { PgSession } from "@data/pg_session";

export class CustomerRepo extends PgBaseRepo implements CustomerRepoInterface {
    constructor(private readonly _pool: Pool) {
        super(_pool);
    }

    create: CustomerRepoInterface["create"] = async (dto, session) => {
        const res = await runQuery<CustomerModelInterface>(
            queries.createCustomerQuery({ ...dto, id: generateId(dto.businessId) }),
            this._pool,
            (session as PgSession)?.client
        );

        return res.rows[0];
    };

    getByBusinessId: CustomerRepoInterface["getByBusinessId"] = async (businessId) => {
        const res = await runQuery<CustomerModelInterface>(
            queries.getByBusinessIdQuery(businessId),
            this._pool
        );

        return res.rows;
    };

    getSingleBusinessCustomer: CustomerRepoInterface["getSingleBusinessCustomer"] = async (dto) => {
        const query = queries.getSingleBusinessCustomerQuery(dto);
        const res = await runQuery<CustomerModelInterface>(query, this._pool);
        const customer = res.rows[0];
        return customer || null;
    };
}
