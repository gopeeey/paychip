import { BusinessWalletModelInterface as BwModelInterface } from "@logic/business_wallet";
import { SessionInterface } from "@logic/session_interface";
import { CreateWalletDto } from "../dtos";
import { WalletModelInterface } from "./wallet.model.interface";
import { WalletRepoInterface } from "./wallet.repo.interface";

export interface WalletCreatorInterface {
    create: () => Promise<WalletModelInterface>;
}

export interface WalletCreatorDependencies {
    dto: CreateWalletDto;
    repo: WalletRepoInterface;

    getBusinessWallet: (
        businessId: BwModelInterface["businessId"],
        currencyCode: BwModelInterface["currencyCode"]
    ) => Promise<BwModelInterface>;

    session?: SessionInterface;
}
