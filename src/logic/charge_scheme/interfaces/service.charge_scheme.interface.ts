import { CreateChargeSchemeDto } from "../dtos";
import { ChargeSchemeModelInterface } from "./charge_scheme.model.interface";
import { ChargeSchemeRepoInterface } from "./charge_scheme.repo.interface";

export interface ChargeSchemeServiceInterface {
    create: (createChargeSchemeDto: CreateChargeSchemeDto) => Promise<ChargeSchemeModelInterface>;

    getById: (id: ChargeSchemeModelInterface["id"]) => Promise<ChargeSchemeModelInterface>;

    checkCompatibility: (
        chargeSchemeId: ChargeSchemeModelInterface["id"],
        currency: ChargeSchemeModelInterface["currency"]
    ) => Promise<boolean>;
}

export interface ChargeSchemeServiceDependencies {
    repo: ChargeSchemeRepoInterface;
}
