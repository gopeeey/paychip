import { SessionInterface } from "@logic/session_interface";
import { CreateBusinessWalletDto } from "../dtos";
import { BusinessWalletModelInterface } from "./business_wallet.model.interface";
import { BusinessWalletRepoInterface } from "./business_wallet.repo.interface";

export interface BusinessWalletServiceInterface {
    createBusinessWallet: (
        createBusinessWalletDto: CreateBusinessWalletDto,
        session?: SessionInterface
    ) => Promise<BusinessWalletModelInterface>;
}

export interface BusinessWalletServiceDeps {
    repo: BusinessWalletRepoInterface;
}
