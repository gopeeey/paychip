import { CreateBusinessDto, StandardBusinessDto } from "../../contracts/dtos";
import {
    BusinessServiceInterface,
    BusinessRepoInterface,
    BusinessDetailsInterface,
} from "../../contracts/interfaces";

export class BusinessService implements BusinessServiceInterface {
    constructor(
        private readonly _repository: BusinessRepoInterface,
        private readonly _details: BusinessDetailsInterface
    ) {}

    async createBusiness(createBusinessDto: CreateBusinessDto) {
        const business = await this._repository.create(createBusinessDto);
        return new StandardBusinessDto(business);
    }
}
