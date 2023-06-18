import { SessionInterface } from "@bases/logic";
import { AddChargeStackToWalletDto, CreateChargeStackDto } from "../dtos";
import { ChargeStackModelInterface } from "./charge_stack.model.interface";
import { WalletChargeStackModelInterface } from "./wallet_charge_stack.model.interface";

export interface ChargesRepoInterface {
    createChargeStack: (
        createChargeStackDto: CreateChargeStackDto,
        session?: SessionInterface
    ) => Promise<ChargeStackModelInterface>;

    addStackToWallet: (addStackDto: AddChargeStackToWalletDto) => Promise<void>;

    getStackById: (
        stackId: ChargeStackModelInterface["id"]
    ) => Promise<ChargeStackModelInterface | null>;

    getWalletChargeStack: (
        walletId: WalletChargeStackModelInterface["walletId"],
        chargeType: WalletChargeStackModelInterface["chargeType"]
    ) => Promise<ChargeStackModelInterface | null>;
}
