import { CreateBusinessDto } from "../../contracts/dtos";
import { BusinessRepoInterface } from "../../contracts/interfaces";
import { Business } from "../models";

export class BusinessRepo implements BusinessRepoInterface {
    constructor(private readonly _modelContext: typeof Business) {}

    async create(createBusinessDto: CreateBusinessDto) {
        const business = await this._modelContext.create(createBusinessDto);
        return business.toJSON();
    }
}
