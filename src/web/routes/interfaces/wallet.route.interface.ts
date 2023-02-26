import { WalletServiceInterface } from "@logic/wallet";
import { AuthMiddlewareInterface } from "@web/middleware";

export interface WalletRouteDependencies {
    walletService: WalletServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
}
