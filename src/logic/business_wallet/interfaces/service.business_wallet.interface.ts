import { SessionInterface } from "@bases/logic";
import { CreateBusinessWalletDto } from "../dtos";
import { BusinessWalletModelInterface as BwModelInterface } from "./business_wallet.model.interface";
import { BusinessWalletRepoInterface as BwRepoInterface } from "./business_wallet.repo.interface";

export interface BusinessWalletServiceInterface {
    createBusinessWallet: (
        createBusinessWalletDto: CreateBusinessWalletDto,
        session?: SessionInterface
    ) => Promise<BwModelInterface>;

    getBusinessWalletByCurrency: (
        businessId: BwModelInterface["businessId"],
        currencyCode: BwModelInterface["currencyCode"]
    ) => Promise<BwModelInterface>;
}

export interface BusinessWalletServiceDeps {
    repo: BwRepoInterface;
    validateCurrencySupported: (currencyCode: BwModelInterface["currencyCode"]) => Promise<void>;
}
