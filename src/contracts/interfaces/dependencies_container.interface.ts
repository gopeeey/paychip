import {
    AccountServiceInterface,
    BusinessServiceInterface,
    CountryServiceInterface,
} from "./logic";

export interface DependencyContainerInterface {
    accountService: AccountServiceInterface;
    businessService: BusinessServiceInterface;
    countryService: CountryServiceInterface;
}
