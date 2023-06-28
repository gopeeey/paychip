import { AccountRepo } from "@accounts/data";
import { BusinessRepo } from "@business/data";
import { ChargesRepo } from "@charges/data";
import { CountryRepo } from "@country/data";
import { CurrencyRepo } from "@currency/data";
import { WalletRepo } from "@wallet/data";
import { TransactionRepo } from "@transaction/data";
import { PaystackRepo } from "@third_party/payment_providers/data";
import { CustomerRepo } from "@customer/data";

import { AccountService } from "@accounts/logic";
import { BusinessService } from "@business/logic";
import { ChargesService } from "@charges/logic";
import { CountryService } from "@country/logic";
import { CurrencyService } from "@currency/logic";
import { WalletService } from "@wallet/logic";
import { TransactionService } from "@transaction/logic";
import { PaymentProviderService } from "@third_party/payment_providers/logic";
import { CustomerService } from "@customer/logic";

import { Pool } from "pg";
import { DependencyContainerInterface } from "./dependencies.container";
import { AuthMiddleware } from "@bases/web";

export const buildContainer = async (pool: Pool) => {
    // accounts
    const accountRepo = new AccountRepo(pool);
    const accountService = new AccountService({ repo: accountRepo });

    const countryRepo = new CountryRepo(pool);
    const countryService = new CountryService({ repo: countryRepo });

    const currencyRepo = new CurrencyRepo(pool);
    const currencyService = new CurrencyService({ repo: currencyRepo });

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
        getCurrency: currencyService.getCurrencyByIsoCode,
        getWalletChargeStack: chargesService.getWalletChargeStack,
        calculateCharges: chargesService.calculateTransactionCharges,
        createTransaction: transactionService.createTransaction,
        generatePaymentLink: paymentProviderService.generatePaymentLink,
        getOrCreateCustomer: customerService.getOrCreateCustomer,
        findTransactionByReference: transactionService.findTransactionByReference,
        updateTransactionStatus: transactionService.updateTransactionStatus,
        verifyTransactionFromProvider: paymentProviderService.verifyTransaction,
    });

    const businessRepo = new BusinessRepo(pool);
    const businessService = new BusinessService({
        repo: businessRepo,
        getAccount: accountService.getById,
        getCountry: countryService.getByCode,
        startSession: businessRepo.startSession,
        createBusinessWallet: walletService.createWallet,
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
