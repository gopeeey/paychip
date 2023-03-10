import { CreateChargeSchemeDto } from "./dtos";
import {
    ChargeSchemeModelInterface,
    ChargeSchemeServiceDependencies,
    ChargeSchemeServiceInterface,
} from "./interfaces";
import { ChargeSchemeNotFoundError } from "./errors";

export class ChargeSchemeService implements ChargeSchemeServiceInterface {
    private readonly _repo: ChargeSchemeServiceDependencies["repo"];

    constructor(private readonly _dependencies: ChargeSchemeServiceDependencies) {
        this._repo = this._dependencies.repo;
    }

    create = async (createChargeSchemeDto: CreateChargeSchemeDto) => {
        const chargeScheme = await this._repo.create(createChargeSchemeDto);
        return chargeScheme;
    };

    getById = async (id: ChargeSchemeModelInterface["id"]) => {
        const chargeScheme = await this._repo.getById(id);
        if (!chargeScheme) throw new ChargeSchemeNotFoundError();
        return chargeScheme;
    };
}
