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
}
