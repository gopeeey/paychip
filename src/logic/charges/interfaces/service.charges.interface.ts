import { SessionInterface } from "@logic/session_interface";
import { CreateChargeStackDto } from "../dtos";
import { ChargesRepoInterface } from "./charges_repo.interface";
import { ChargeStackModelInterface } from "./charge_stack.model.interface";

export interface ChargesServiceInterface {
    createStack: (
        createStackDto: CreateChargeStackDto,
        session?: SessionInterface
    ) => Promise<ChargeStackModelInterface>;
}

export interface ChargesServiceDependencies {
    repo: ChargesRepoInterface;
}
