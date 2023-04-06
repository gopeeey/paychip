import { SessionInterface } from "@logic/session_interface";
import {
    AddChargeStackToWalletDto,
    AddChargesToStackDto,
    CreateChargeDto,
    CreateChargeStackDto,
} from "../dtos";
import { ChargeModelInterface } from "./charge.model.interface";
import { ChargeStackModelInterface } from "./charge_stack.model.interface";

export interface ChargesRepoInterface {
    createChargeStack: (
        createChargeStackDto: CreateChargeStackDto,
        session?: SessionInterface
    ) => Promise<ChargeStackModelInterface>;

    addStackToWallet: (addStackDto: AddChargeStackToWalletDto) => Promise<void>;

    createCharge: (createChargeDto: CreateChargeDto) => Promise<ChargeModelInterface>;

    getStackById: (stackId: ChargeStackModelInterface["id"]) => Promise<ChargeStackModelInterface>;

    addChargesToStack: (
        addChargesToStackDto: AddChargesToStackDto
    ) => Promise<ChargeStackModelInterface>;
}
