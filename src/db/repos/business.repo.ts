import { CreateBusinessDto } from "../../contracts/dtos";
import {
    AccountModelInterface,
    BusinessModelInterface,
    BusinessRepoInterface,
} from "../../contracts/interfaces";
import { Business } from "../models";

export class BusinessRepo implements BusinessRepoInterface {
    constructor(private readonly _modelContext: typeof Business) {}

    async create(createBusinessDto: CreateBusinessDto) {
        const business = await this._modelContext.create(createBusinessDto);
        return business.toJSON();
    }

    async findById(id: BusinessModelInterface["id"]) {
        const business = await this._modelContext.findByPk(id);
        return business ? business.toJSON() : null;
    }

    async getOwnerBusinesses(ownerId: AccountModelInterface["id"]) {
        const businesses = await this._modelContext.findAll({
            where: { ownerId },
            include: "currencies",
        });
        return businesses.map((business) => business.toJSON());
    }
}
