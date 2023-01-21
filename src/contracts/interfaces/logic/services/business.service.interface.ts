import { CreateBusinessDto, StandardBusinessDto } from "../../../dtos";

export interface BusinessServiceInterface {
    createBusiness: (dto: CreateBusinessDto) => Promise<StandardBusinessDto>;
}
