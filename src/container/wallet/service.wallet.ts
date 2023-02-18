import { WalletService } from "../../logic/services";
import { walletRepo } from "./repo.wallet";

export const walletService = new WalletService({ repo: walletRepo });

export const createWallet = walletService.createWallet;
