import { AccountRepo } from "@accounts/data";
import { BusinessRepo } from "@business/data";
import { ChargesRepo } from "@charges/data";
import { CountryRepo } from "@country/data";
import { CurrencyRepo } from "@currency/data";
import { WalletRepo, TransactionRepo } from "@wallet/data";
import { PaystackRepo } from "@payment_providers/data";
import { CustomerRepo } from "@customer/data";

import { AccountService } from "@accounts/logic";
import { BusinessService } from "@business/logic";
import { ChargesService } from "@charges/logic";
import { CountryService } from "@country/logic";
import { CurrencyService } from "@currency/logic";
import { WalletService, TransactionService } from "@wallet/logic";
import { PaymentProviderService } from "@payment_providers/logic";
import { CustomerService } from "@customer/logic";

import { RedisService } from "@db/redis";

import { Pool } from "pg";
import { DependencyContainerInterface } from "./dependencies.container";
import { AuthMiddleware } from "@bases/web";

// queues
import { RabbitTransactionQueue, TransactionMessageDto } from "@queues/transactions";

export const buildContainer = async (pool: Pool) => {
    // imds
    const imdsService = new RedisService();

    // queues
    const transactionQueue = new RabbitTransactionQueue();

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
        imdsService,
        getCurrency: currencyService.getCurrencyByIsoCode,
        getWalletChargeStack: chargesService.getWalletChargeStack,
        calculateCharges: chargesService.calculateTransactionCharges,
        createTransaction: transactionService.createTransaction,
        generatePaymentLink: paymentProviderService.generatePaymentLink,
        getOrCreateCustomer: customerService.getOrCreateCustomer,
        findTransactionByReference: transactionService.findTransactionByReference,
        updateTransactionInfo: transactionService.updateTransactionInfo,
        verifyTransactionFromProvider: paymentProviderService.verifyTransaction,
        updateCustomer: customerService.updateCustomer,
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
        paymentProviderService,
        publishTransactionTask: transactionQueue.publish,
    };

    // consume queues
    transactionQueue.consume(walletService.dequeueTransaction);

    return container;
};
