import { SessionInterface } from "@logic/session_interface";
import { AddChargeStackToWalletDto, CreateChargeStackDto } from "../dtos";
import { ChargesRepoInterface } from "./charges_repo.interface";
import { ChargeStackModelInterface } from "./charge_stack.model.interface";

export interface ChargesServiceInterface {
    createStack: (
        createStackDto: CreateChargeStackDto,
        session?: SessionInterface
    ) => Promise<ChargeStackModelInterface>;

    addStackToWallet: (addStackToWalletDto: AddChargeStackToWalletDto) => Promise<void>;
}

export interface ChargesServiceDependencies {
    repo: ChargesRepoInterface;
}
