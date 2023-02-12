import { CreateChargeSchemeDto, StandardChargeSchemeDto } from "../../../../dtos";
import { ChargeSchemeModelInterface, ChargeSchemeRepoInterface } from "../../../db";

export interface ChargeSchemeServiceInterface {
    create: (createChargeSchemeDto: CreateChargeSchemeDto) => Promise<StandardChargeSchemeDto>;

    getById: (id: ChargeSchemeModelInterface["id"]) => Promise<StandardChargeSchemeDto | null>;
}

export interface ChargeSchemeServiceDependencies {
    repo: ChargeSchemeRepoInterface;
}
