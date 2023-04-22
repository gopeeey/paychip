import { CreateCustomerDto, CustomerModelInterface, CustomerRepoInterface } from "@logic/customer";
import { Transaction } from "sequelize";
import { generateId } from "src/utils";
import { Customer } from "./customer.model";
import { PgBaseRepo } from "@data/pg_base_repo";
import { Pool } from "pg";
import { runQuery } from "@data/db";
import * as queries from "./queries";
import { PgSession } from "@data/pg_session";

export class CustomerRepo extends PgBaseRepo implements CustomerRepoInterface {
    constructor(private readonly __pool: Pool) {
        super(__pool);
    }

    create: CustomerRepoInterface["create"] = async (dto, session) => {
        const res = await runQuery<CustomerModelInterface>(
            queries.createCustomerQuery({ ...dto, id: generateId(dto.businessId) }),
            this.__pool,
            (session as PgSession)?.client
        );

        return res.rows[0];
    };

    getByBusinessId: CustomerRepoInterface["getByBusinessId"] = async (businessId) => {
        const res = await runQuery<CustomerModelInterface>(
            queries.getByBusinessIdQuery(businessId),
            this.__pool
        );

        return res.rows;
    };
}
