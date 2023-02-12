import { CreateChargeSchemeDto, StandardChargeSchemeDto } from "../../../contracts/dtos";
import {
    ChargeSchemeModelInterface,
    ChargeSchemeServiceDependencies,
    ChargeSchemeServiceInterface,
} from "../../../contracts/interfaces";

export class ChargeSchemeService implements ChargeSchemeServiceInterface {
    private readonly _repo: ChargeSchemeServiceDependencies["repo"];

    constructor(private readonly _dependencies: ChargeSchemeServiceDependencies) {
        this._repo = this._dependencies.repo;
    }

    create = async (createChargeSchemeDto: CreateChargeSchemeDto) => {
        const chargeScheme = await this._repo.create(createChargeSchemeDto);
        return new StandardChargeSchemeDto(chargeScheme);
    };

    getById = async (id: ChargeSchemeModelInterface["id"]) => {
        const chargeScheme = await this._repo.getById(id);
        return chargeScheme ? new StandardChargeSchemeDto(chargeScheme) : null;
    };
}
