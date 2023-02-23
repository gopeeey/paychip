import { WalletService } from "../../logic/services";
import { walletRepo } from "./repo.wallet";
import { isSupportedBusinessCurrency } from "../currency";

export const walletService = new WalletService({ repo: walletRepo, isSupportedBusinessCurrency });

export const createWallet = walletService.createWallet;
