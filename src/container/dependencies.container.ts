import { AccountServiceInterface } from "@logic/account";
import { BusinessServiceInterface } from "@logic/business";
import { ChargeSchemeServiceInterface } from "@logic/charge_scheme";
import { CountryServiceInterface } from "@logic/country";
import { WalletServiceInterface } from "@logic/wallet";
import { AuthMiddlewareInterface } from "@web/middleware";

export interface DependencyContainerInterface {
    accountService: AccountServiceInterface;
    businessService: BusinessServiceInterface;
    chargeSchemeService: ChargeSchemeServiceInterface;
    countryService: CountryServiceInterface;
    walletService: WalletServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
}
