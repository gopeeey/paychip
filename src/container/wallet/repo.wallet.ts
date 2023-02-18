import { Wallet } from "../../db/models";
import { WalletRepo } from "../../db/repos";

export const walletRepo = new WalletRepo(Wallet);
