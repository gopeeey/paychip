import { CustomerModelInterface, CustomerRepoInterface, UpdateCustomerDto } from "@customer/logic";
import { generateId } from "src/utils";
import { PgBaseRepo } from "@db/postgres";
import { Pool } from "pg";
import { runQuery } from "@db/postgres";
import * as queries from "./queries";
import { PgSession } from "@db/postgres";

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

    updateCustomer: CustomerRepoInterface["updateCustomer"] = async (data, session) => {
        const query = queries.updateCustomerQuery(data);
        await runQuery(query, this._pool, (session as PgSession)?.client);
    };
}
