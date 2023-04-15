import { BusinessModelInterface, BusinessRepoInterface } from "@logic/business";
import { runQuery } from "@data/db";
import { Pool } from "pg";
import * as queries from "./queries";

export class BusinessRepo implements BusinessRepoInterface {
    constructor(private readonly __pool: Pool) {}

    create: BusinessRepoInterface["create"] = async (createBusinessDto, client) => {
        const res = await runQuery<BusinessModelInterface>(
            queries.createBusinessQuery(createBusinessDto),
            this.__pool,
            client
        );
        const business = res.rows[0];
        if (!business) throw new Error("Error creating business");
        return business;
    };

    findById = async (id: BusinessModelInterface["id"]) => {
        const res = await runQuery<BusinessModelInterface>(queries.findById(id), this.__pool);
        return res.rows[0] || null;
    };

    getOwnerBusinesses = async (ownerId: BusinessModelInterface["ownerId"]) => {
        const res = await runQuery<BusinessModelInterface>(
            queries.getOwnerBusinesses(ownerId),
            this.__pool
        );
        return res.rows;
    };

    // getFullBusiness = async (businessId: BusinessModelInterface["id"]) => {
    //     const business = await this._modelContext.findByPk(businessId, { include: "currencies" });
    //     if (!business) return null;
    //     return business.toJSON();
    // };
}
