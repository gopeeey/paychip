import { SessionInterface } from "@logic/session_interface";
import { CreateChargeStackDto } from "../dtos";
import { ChargeStackModelInterface } from "./charge_stack.model.interface";

export interface ChargesRepoInterface {
    createChargeStack: (
        createChargeStackDto: CreateChargeStackDto,
        session?: SessionInterface
    ) => Promise<ChargeStackModelInterface>;
}
