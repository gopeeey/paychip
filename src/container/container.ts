import { DependencyContainerInterface } from "./dependencies.container";
import { accountService } from "./account";
import { businessService } from "./business";
import { countryService } from "./country";
import { walletService } from "./wallet";
import { chargesService } from "./charges";
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
    chargesService,
};
