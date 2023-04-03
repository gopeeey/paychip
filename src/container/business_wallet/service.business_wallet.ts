import { BusinessWalletService } from "@logic/business_wallet";
import { validateCurrencySupported } from "../currency";
import { businessWalletRepo } from "./repo.business_wallet";

export const businessWalletService = new BusinessWalletService({
    repo: businessWalletRepo,
    validateCurrencySupported,
});

export const createBusinessWallet = businessWalletService.createBusinessWallet;
export const getBusinessWalletByCurrency = businessWalletService.getBusinessWalletByCurrency;
