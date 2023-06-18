import { AccountServiceInterface } from "@accounts/logic";
import { BusinessServiceInterface } from "@business/logic";
import { ChargesServiceInterface } from "@charges/logic";
import { CountryServiceInterface } from "@logic/country";
import { WalletServiceInterface } from "@logic/wallet";
import { AuthMiddlewareInterface } from "@web/middleware";

export interface DependencyContainerInterface {
    accountService: AccountServiceInterface;
    businessService: BusinessServiceInterface;
    chargesService: ChargesServiceInterface;
    countryService: CountryServiceInterface;
    walletService: WalletServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
}
