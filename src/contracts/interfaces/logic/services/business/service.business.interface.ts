import { CreateBusinessDto, StandardBusinessDto } from "../../../../dtos";
import { BusinessRepoInterface } from "../../../db";
import { CountrySupportedCheckerInterface } from "../country";

export interface BusinessServiceInterface {
    createBusiness: (dto: CreateBusinessDto) => Promise<StandardBusinessDto>;
}

export interface BusinessServiceDependenciesInterface {
    repo: BusinessRepoInterface;
    checkCountrySupported: CountrySupportedCheckerInterface["check"];
}
