import { SessionInterface } from "@logic/session_interface";
import { CreateWalletDto, GetUniqueWalletDto } from "../dtos";
import { WalletModelInterface } from "./wallet.model.interface";

export interface WalletRepoInterface {
    create: (
        createWalletDto: CreateWalletDto,
        session?: SessionInterface
    ) => Promise<WalletModelInterface>;
    getById: (id: WalletModelInterface["id"]) => Promise<WalletModelInterface | null>;

    getUnique: (getUniqueDto: GetUniqueWalletDto) => Promise<WalletModelInterface | null>;

    getBusinessRootWallet: (
        businessId: WalletModelInterface["businessId"],
        currency: WalletModelInterface["currency"]
    ) => Promise<WalletModelInterface | null>;
}
