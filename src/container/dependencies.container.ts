import { AccountServiceInterface } from "@logic/account";
import { BusinessServiceInterface } from "@logic/business";
import { ChargesServiceInterface } from "@logic/charges";
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
