import { SessionInterface } from "@logic/session_interface";
import {
    AddChargeStackToWalletDto,
    CalculateTransactionChargesDto,
    ChargeDto,
    ChargeStackDto,
    ChargesCalculationResultDto,
    CreateChargeStackDto,
} from "../dtos";
import { ChargesRepoInterface } from "./charges_repo.interface";
import { ChargeStackModelInterface } from "./charge_stack.model.interface";
import { WalletChargeStackModelInterface } from "./wallet_charge_stack.model.interface";

export interface ChargesServiceInterface {
    createStack: (
        createStackDto: CreateChargeStackDto,
        session?: SessionInterface
    ) => Promise<ChargeStackModelInterface>;

    addStackToWallet: (addStackToWalletDto: AddChargeStackToWalletDto) => Promise<void>;

    getCompatibleCharge: (amount: number, charges: ChargeStackDto["charges"]) => ChargeDto | null;

    calculateCharge: (amount: number, charge: ChargeDto) => number;

    calculateTransactionCharges: (
        data: CalculateTransactionChargesDto
    ) => ChargesCalculationResultDto;

    getWalletChargeStack: (
        walletId: WalletChargeStackModelInterface["walletId"],
        chargeType: WalletChargeStackModelInterface["chargeType"]
    ) => Promise<ChargeStackModelInterface | null>;
}

export interface ChargesServiceDependencies {
    repo: ChargesRepoInterface;
}
