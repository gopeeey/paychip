import { CreateChargeSchemeDto } from "../../../dtos";
import { ChargeSchemeModelInterface } from "../models";

export interface ChargeSchemeRepoInterface {
    create: (createChargeSchemeDto: CreateChargeSchemeDto) => Promise<ChargeSchemeModelInterface>;
    getById: (id: ChargeSchemeModelInterface["id"]) => Promise<ChargeSchemeModelInterface | null>;
}
