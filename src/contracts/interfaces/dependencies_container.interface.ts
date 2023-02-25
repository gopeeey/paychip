import {
    AccountServiceInterface,
    BusinessServiceInterface,
    ChargeSchemeServiceInterface,
    CountryServiceInterface,
    WalletServiceInterface,
} from "./logic";
import { AuthMiddlewareInterface } from "./web";

export interface DependencyContainerInterface {
    accountService: AccountServiceInterface;
    businessService: BusinessServiceInterface;
    chargeSchemeService: ChargeSchemeServiceInterface;
    countryService: CountryServiceInterface;
    walletService: WalletServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
}
