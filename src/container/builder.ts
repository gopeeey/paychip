import { AccountRepo } from "@accounts/data";
import { BusinessRepo } from "@business/data";
import { BusinessWalletRepo } from "@data/business_wallet";
import { ChargesRepo } from "@data/charges";
import { CountryRepo } from "@data/country";
import { CurrencyRepo } from "@data/currency";
import { WalletRepo } from "@data/wallet";
import { TransactionRepo } from "@data/transaction";
import { PaystackRepo } from "@data/payment_providers";
import { CustomerRepo } from "@data/customer";

import { AccountService } from "@accounts/logic";
import { BusinessService } from "@logic/business";
import { BusinessWalletService } from "@logic/business_wallet";
import { ChargesService } from "@logic/charges";
import { CountryService } from "@logic/country";
import { CurrencyService } from "@logic/currency";
import { WalletService } from "@logic/wallet";
import { TransactionService } from "@logic/transaction";
import { PaymentProviderService } from "@logic/payment_providers";
import { CustomerService } from "@logic/customer";

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

    const customerRepo = new CustomerRepo(pool);
    const customerService = new CustomerService({ repo: customerRepo });

    const chargesRepo = new ChargesRepo(pool);
    const chargesService = new ChargesService({ repo: chargesRepo });

    const transactionRepo = new TransactionRepo(pool);
    const transactionService = new TransactionService({ repo: transactionRepo });

    const paystackRepo = new PaystackRepo();
    const paymentProviderService = new PaymentProviderService({
        paystack: paystackRepo,
    });

    const walletRepo = new WalletRepo(pool);
    const walletService = new WalletService({
        repo: walletRepo,
        getBusinessWallet: businessWalletService.getBusinessWalletByCurrency,
        getCurrency: currencyService.getCurrencyByIsoCode,
        getWalletChargeStack: chargesService.getWalletChargeStack,
        calculateCharges: chargesService.calculateTransactionCharges,
        createTransaction: transactionService.createTransaction,
        generatePaymentLink: paymentProviderService.generatePaymentLink,
        getOrCreateCustomer: customerService.getOrCreateCustomer,
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
