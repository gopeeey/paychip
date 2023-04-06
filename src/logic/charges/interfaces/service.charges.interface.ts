import { SessionInterface } from "@logic/session_interface";
import {
    AddChargeStackToWalletDto,
    AddChargesToStackDto,
    CreateChargeDto,
    CreateChargeStackDto,
} from "../dtos";
import { ChargeModelInterface } from "./charge.model.interface";
import { ChargesRepoInterface } from "./charges_repo.interface";
import { ChargeStackModelInterface } from "./charge_stack.model.interface";

export interface ChargesServiceInterface {
    createStack: (
        createStackDto: CreateChargeStackDto,
        session?: SessionInterface
    ) => Promise<ChargeStackModelInterface>;

    addStackToWallet: (addStackToWalletDto: AddChargeStackToWalletDto) => Promise<void>;

    createCharge: (createChargeDto: CreateChargeDto) => Promise<ChargeModelInterface>;

    addChargesToStack: (
        addChargesToStackDto: AddChargesToStackDto
    ) => Promise<ChargeStackModelInterface>;
}

export interface ChargesServiceDependencies {
    repo: ChargesRepoInterface;
}
