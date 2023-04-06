import { chargeStackJson } from "src/__tests__/samples";
import {
    ChargesServiceDependencies,
    ChargesServiceInterface,
} from "./interfaces/service.charges.interface";

export class ChargesService implements ChargesServiceInterface {
    private readonly _repo: ChargesServiceDependencies["repo"];

    constructor(private readonly _deps: ChargesServiceDependencies) {
        this._repo = this._deps.repo;
    }

    createStack: ChargesServiceInterface["createStack"] = async (createStackDto, session) => {
        const chargeStack = await this._repo.createChargeStack(createStackDto, session);
        return chargeStack;
    };

    addStackToWallet: ChargesServiceInterface["addStackToWallet"] = async (addStackToWalletDto) => {
        await this._repo.addStackToWallet(addStackToWalletDto);
    };

    createCharge: ChargesServiceInterface["createCharge"] = async (createChargeDto) => {
        const charge = await this._repo.createCharge(createChargeDto);
        return charge;
    };

    addChargesToStack: ChargesServiceInterface["addChargesToStack"] = async (
        addChargeToStackDto
    ) => {
        const chargeStack = await this._repo.addChargesToStack(addChargeToStackDto);
        return chargeStack;
    };
}
