import { WalletService } from "@logic/wallet";
import { getBusinessWalletByCurrency } from "../business_wallet";
import { walletRepo } from "./repo.wallet";

export const walletService = new WalletService({
    repo: walletRepo,
    getBusinessWallet: getBusinessWalletByCurrency,
});

export const createWallet = walletService.createWallet;
