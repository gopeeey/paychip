import { BusinessModelInterface, BusinessRepoInterface } from "@business/logic";
import { runQuery } from "@data/db";
import { Pool } from "pg";
import * as queries from "./queries";
import { PgSession } from "@data/pg_session";
import { PgBaseRepo } from "@data/pg_base_repo";

export class BusinessRepo extends PgBaseRepo implements BusinessRepoInterface {
    constructor(private readonly _pool: Pool) {
        super(_pool);
    }

    create: BusinessRepoInterface["create"] = async (createBusinessDto, session) => {
        const res = await runQuery<BusinessModelInterface>(
            queries.createBusinessQuery(createBusinessDto),
            this._pool,
            (session as PgSession)?.client
        );
        const business = res.rows[0];
        if (!business) throw new Error("Error creating business");
        return business;
    };

    findById = async (id: BusinessModelInterface["id"]) => {
        const res = await runQuery<BusinessModelInterface>(queries.findById(id), this._pool);
        return res.rows[0] || null;
    };

    getOwnerBusinesses = async (ownerId: BusinessModelInterface["ownerId"]) => {
        const res = await runQuery<BusinessModelInterface>(
            queries.getOwnerBusinesses(ownerId),
            this._pool
        );
        return res.rows;
    };

    // getFullBusiness = async (businessId: BusinessModelInterface["id"]) => {
    //     const business = await this._modelContext.findByPk(businessId, { include: "currencies" });
    //     if (!business) return null;
    //     return business.toJSON();
    // };
}
