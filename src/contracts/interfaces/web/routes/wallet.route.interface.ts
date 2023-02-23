import { WalletServiceInterface } from "../../logic";
import { AuthMiddlewareInterface } from "../middleware";

export interface WalletRouteDependencies {
    walletService: WalletServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
}
