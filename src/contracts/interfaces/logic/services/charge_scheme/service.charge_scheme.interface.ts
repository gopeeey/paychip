import { CreateChargeSchemeDto } from "../../../../dtos";
import { ChargeSchemeModelInterface, ChargeSchemeRepoInterface } from "../../../db";

export interface ChargeSchemeServiceInterface {
    create: (createChargeSchemeDto: CreateChargeSchemeDto) => Promise<ChargeSchemeModelInterface>;

    getById: (id: ChargeSchemeModelInterface["id"]) => Promise<ChargeSchemeModelInterface>;
}

export interface ChargeSchemeServiceDependencies {
    repo: ChargeSchemeRepoInterface;
}
