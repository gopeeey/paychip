import { BusinessWalletService } from "@logic/business_wallet";
import { businessWalletRepo } from "./repo.business_wallet";

export const businessWalletService = new BusinessWalletService({
    repo: businessWalletRepo,
});

export const createBusinessWallet = businessWalletService.createBusinessWallet;
export const getBusinessWalletByCurrency = businessWalletService.getBusinessWalletByCurrency;
