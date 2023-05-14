import { SessionInterface } from "@logic/session_interface";
import {
    AddChargeStackToWalletDto,
    CalculateTransactionChargesDto,
    ChargeDto,
    ChargeStackDto,
    CreateChargeStackDto,
} from "../dtos";
import { ChargesRepoInterface } from "./charges_repo.interface";
import { ChargeStackModelInterface } from "./charge_stack.model.interface";

export interface ChargesServiceInterface {
    createStack: (
        createStackDto: CreateChargeStackDto,
        session?: SessionInterface
    ) => Promise<ChargeStackModelInterface>;

    addStackToWallet: (addStackToWalletDto: AddChargeStackToWalletDto) => Promise<void>;

    getCompatibleCharge: (amount: number, charges: ChargeStackDto["charges"]) => ChargeDto | null;

    calculateChargeAmounts: (amount: number, charge: ChargeDto) => { charge: number; got: number };

    calculateTransactionCharges: (data: CalculateTransactionChargesDto) => Promise<void>;
}

export interface ChargesServiceDependencies {
    repo: ChargesRepoInterface;
}
