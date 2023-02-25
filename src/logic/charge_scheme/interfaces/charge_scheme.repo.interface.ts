import { CreateChargeSchemeDto } from "../dtos";
import { ChargeSchemeModelInterface } from "./charge_scheme.model.interface";

export interface ChargeSchemeRepoInterface {
    create: (createChargeSchemeDto: CreateChargeSchemeDto) => Promise<ChargeSchemeModelInterface>;
    getById: (id: ChargeSchemeModelInterface["id"]) => Promise<ChargeSchemeModelInterface | null>;
}
