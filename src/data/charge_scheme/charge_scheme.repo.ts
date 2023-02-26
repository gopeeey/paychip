import {
    CreateChargeSchemeDto,
    ChargeSchemeRepoInterface,
    ChargeSchemeModelInterface,
} from "@logic/charge_scheme";
import { ChargeScheme } from "./charge_scheme.model";

export class ChargeSchemeRepo implements ChargeSchemeRepoInterface {
    constructor(private readonly _modelContext: typeof ChargeScheme) {}

    create = async (createChargeSchemeDto: CreateChargeSchemeDto) => {
        const chargeScheme = await this._modelContext.create(createChargeSchemeDto);
        return chargeScheme.toJSON();
    };

    getById = async (id: ChargeSchemeModelInterface["id"]) => {
        const chargeScheme = await this._modelContext.findByPk(id);
        return chargeScheme ? chargeScheme.toJSON() : null;
    };
}
