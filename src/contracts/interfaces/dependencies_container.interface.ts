import {
    AccountServiceInterface,
    BusinessServiceInterface,
    CountryServiceInterface,
    WalletServiceInterface,
} from "./logic";
import { AuthMiddlewareInterface } from "./web";

export interface DependencyContainerInterface {
    accountService: AccountServiceInterface;
    businessService: BusinessServiceInterface;
    countryService: CountryServiceInterface;
    walletService: WalletServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
}
