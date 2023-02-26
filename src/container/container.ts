import { DependencyContainerInterface } from "./dependencies.container";
import { accountService } from "./account";
import { businessService } from "./business";
import { countryService } from "./country";
import { walletService } from "./wallet";
import { chargeSchemeService } from "./charge_scheme";
import { AuthMiddleware } from "@web/middleware";

const authMiddleware = new AuthMiddleware({
    accountService: accountService,
    businessService: businessService,
});

export const container: DependencyContainerInterface = {
    accountService,
    businessService,
    countryService,
    authMiddleware,
    walletService,
    chargeSchemeService,
};
