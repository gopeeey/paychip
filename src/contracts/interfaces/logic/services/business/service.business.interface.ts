import { CreateBusinessDto, StandardBusinessDto } from "../../../../dtos";
import { BusinessRepoInterface, BusinessModelInterface } from "../../../db";
import { CountrySupportedCheckerInterface } from "../country";

export interface BusinessServiceInterface {
    createBusiness: (dto: CreateBusinessDto) => Promise<StandardBusinessDto>;
    getById: (id: BusinessModelInterface["id"]) => Promise<StandardBusinessDto>;
}

export interface BusinessServiceDependenciesInterface {
    repo: BusinessRepoInterface;
    checkCountrySupported: CountrySupportedCheckerInterface["check"];
}