import { AccountRepo } from "@data/accounts";
import { BusinessRepo } from "@data/business";
import { BusinessWalletRepo } from "@data/business_wallet";
import { ChargesRepo } from "@data/charges";
import { CountryRepo } from "@data/country";
import { CurrencyRepo } from "@data/currency";
import { WalletRepo } from "@data/wallet";
import { AccountService } from "@logic/accounts";
import { BusinessService } from "@logic/business";
import { BusinessWalletService } from "@logic/business_wallet";
import { ChargesService } from "@logic/charges";
import { CountryService } from "@logic/country";
import { CurrencyService } from "@logic/currency";
import { WalletService } from "@logic/wallet";
import { Pool } from "pg";
import { DependencyContainerInterface } from "./dependencies.container";
import { AuthMiddleware } from "@web/middleware";

export const buildContainer = async (pool: Pool) => {
    // accounts
    const accountRepo = new AccountRepo(pool);
    const accountService = new AccountService({ repo: accountRepo });

    const countryRepo = new CountryRepo(pool);
    const countryService = new CountryService({ repo: countryRepo });

    const currencyRepo = new CurrencyRepo(pool);
    const currencyService = new CurrencyService({ repo: currencyRepo });

    const businessWalletRepo = new BusinessWalletRepo(pool);
    const businessWalletService = new BusinessWalletService({
        repo: businessWalletRepo,
        validateCurrencySupported: currencyService.validateIsSupported,
    });

    const businessRepo = new BusinessRepo(pool);
    const businessService = new BusinessService({
        repo: businessRepo,
        getAccount: accountService.getById,
        getCountry: countryService.getByCode,
        startSession: businessRepo.startSession,
        createBusinessWallet: businessWalletService.createBusinessWallet,
    });

    const chargesRepo = new ChargesRepo(pool);
    const chargesService = new ChargesService({ repo: chargesRepo });

    const walletRepo = new WalletRepo(pool);
    const walletService = new WalletService({
        repo: walletRepo,
        getBusinessWallet: businessWalletService.getBusinessWalletByCurrency,
    });

    const authMiddleware = new AuthMiddleware({ accountService, businessService });

    const container: DependencyContainerInterface = {
        accountService,
        authMiddleware,
        businessService,
        chargesService,
        countryService,
        walletService,
    };

    return container;
};
