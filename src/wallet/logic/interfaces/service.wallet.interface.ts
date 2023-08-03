import { ImdsInterface, SessionInterface } from "@bases/logic";
import {
    CreateWalletDto,
    InitializeFundingDto,
    GetUniqueWalletDto,
    ResolveTransactionDto,
    IncrementBalanceDto,
} from "../dtos";
import { WalletModelInterface } from "./wallet.model.interface";
import { WalletRepoInterface } from "./wallet.repo.interface";
import { CurrencyModelInterface } from "@currency/logic";
import {
    ChargeStackModelInterface,
    ChargesServiceInterface,
    WalletChargeStackModelInterface,
} from "@charges/logic";
import { TransactionServiceInterface } from "@wallet/logic";
import { PaymentProviderService, PaymentProviderServiceInterface } from "@payment_providers/logic";
import { CustomerServiceInterface } from "@customer/logic";
import { NotificationServiceInterface } from "@notifications/logic";
import { TransferQueueInterface } from "@queues/transfers";

export interface WalletServiceInterface {
    createWallet: (
        createWalletDto: CreateWalletDto,
        session?: SessionInterface
    ) => Promise<WalletModelInterface>;

    getWalletById: (id: WalletModelInterface["id"]) => Promise<WalletModelInterface>;
    getWalletByIdWithBusinessWallet: (
        id: WalletModelInterface["id"]
    ) => Promise<WalletModelInterface>;
    getUniqueWallet: (uniqueData: GetUniqueWalletDto) => Promise<WalletModelInterface>;
    initializeFunding: (fundingDto: InitializeFundingDto) => Promise<string>;
    resolveTransaction: (resolveTransactionDto: ResolveTransactionDto) => Promise<void>;
    incrementBalance: (data: IncrementBalanceDto) => Promise<void>;
    getBusinessWalletByCurrency: (
        businessId: WalletModelInterface["businessId"],
        currency: WalletModelInterface["currency"]
    ) => Promise<WalletModelInterface>;
    dequeueTransaction: (msg: unknown) => Promise<void>;
    dequeueTransfer: (msg: unknown) => Promise<void>;
}

export interface WalletServiceDependencies {
    repo: WalletRepoInterface;
    imdsService: ImdsInterface;
    getCurrency: (
        currencyCode: WalletModelInterface["currency"]
    ) => Promise<CurrencyModelInterface>;
    getWalletChargeStack: (
        walletId: WalletModelInterface["id"],
        chargeType: WalletChargeStackModelInterface["chargeType"]
    ) => Promise<ChargeStackModelInterface | null>;
    calculateCharges: ChargesServiceInterface["calculateTransactionCharges"];
    createTransaction: TransactionServiceInterface["createTransaction"];
    findTransactionByReference: TransactionServiceInterface["findTransactionByReference"];
    generatePaymentLink: PaymentProviderService["generatePaymentLink"];
    getOrCreateCustomer: CustomerServiceInterface["getOrCreateCustomer"];
    verifyTransactionFromProvider: PaymentProviderServiceInterface["verifyTransaction"];
    updateTransactionInfo: TransactionServiceInterface["updateTransactionInfo"];
    updateCustomer: CustomerServiceInterface["updateCustomer"];
    sendEmail: NotificationServiceInterface["sendEmail"];
    publishTransfer: TransferQueueInterface["publish"];
}
