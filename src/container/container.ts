import { DependencyContainerInterface } from "../contracts/interfaces";
import { accountService } from "./account";
import { businessService } from "./business";
import { countryService } from "./country";

export const container: DependencyContainerInterface = {
    accountService,
    businessService,
    countryService,
};
