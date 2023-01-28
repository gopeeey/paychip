import {
    AccountServiceInterface,
    BusinessServiceInterface,
    CountryServiceInterface,
} from "./logic";
import { AuthMiddlewareInterface } from "./web";

export interface DependencyContainerInterface {
    accountService: AccountServiceInterface;
    businessService: BusinessServiceInterface;
    countryService: CountryServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
}
