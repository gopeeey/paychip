import { BusinessModelInterface, BusinessRepoInterface } from "@logic/business";
import { Transaction } from "sequelize";
import { Business } from "./business.model";

export class BusinessRepo implements BusinessRepoInterface {
    constructor(private readonly _modelContext: typeof Business) {}

    create: BusinessRepoInterface["create"] = async (createBusinessDto, session) => {
        const business = await this._modelContext.create(createBusinessDto, {
            transaction: session as Transaction,
        });
        return business.toJSON();
    };

    findById = async (id: BusinessModelInterface["id"]) => {
        const business = await this._modelContext.findByPk(id);
        return business ? business.toJSON() : null;
    };

    getOwnerBusinesses = async (ownerId: BusinessModelInterface["ownerId"]) => {
        const businesses = await this._modelContext.findAll({
            where: { ownerId },
            include: "currencies",
        });
        return businesses.map((business) => business.toJSON());
    };

    getFullBusiness = async (businessId: BusinessModelInterface["id"]) => {
        const business = await this._modelContext.findByPk(businessId, { include: "currencies" });
        if (!business) return null;
        return business.toJSON();
    };
}
