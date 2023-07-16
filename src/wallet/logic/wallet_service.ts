import {
    WalletRepoInterface,
    WalletServiceDependencies,
    WalletServiceInterface,
} from "./interfaces";
import { WalletCreator } from "./creator.wallet";
import { FundingInitializer } from "./funding_initializer.wallet";
import { TransactionResolutionError, WalletNotFoundError } from "./errors";
import { TransactionResolver } from "./transaction_resolver.wallet";
import { TransactionMessageDto } from "@queues/transactions";
import { ResolveTransactionDto } from "./dtos";

export class WalletService implements WalletServiceInterface {
    private _repo: WalletRepoInterface;

    constructor(private readonly _dep: WalletServiceDependencies) {
        this._repo = this._dep.repo;
    }

    createWallet: WalletServiceInterface["createWallet"] = async (createWalletDto, session) => {
        const wallet = await new WalletCreator({
            dto: createWalletDto,
            repo: this._repo,
            getBusinessWallet: this.getBusinessWalletByCurrency,
            session,
        }).create();
        return wallet;
    };

    getWalletById: WalletServiceInterface["getWalletById"] = async (id) => {
        const wallet = await this._repo.getById(id);
        if (!wallet) throw new WalletNotFoundError(id);
        return wallet;
    };

    getUniqueWallet: WalletServiceInterface["getUniqueWallet"] = async (uniqueData) => {
        const wallet = await this._repo.getUnique(uniqueData);
        if (!wallet) throw new WalletNotFoundError(uniqueData);
        return wallet;
    };

    getBusinessWalletByCurrency: WalletServiceInterface["getBusinessWalletByCurrency"] = async (
        businessId,
        currency
    ) => {
        const businessWallet = await this._repo.getBusinessWalletByCurrency(businessId, currency);
        if (!businessWallet) throw new WalletNotFoundError({ businessId, currency });
        return businessWallet;
    };

    initializeFunding: WalletServiceInterface["initializeFunding"] = async (fundingDto) => {
        const link = await new FundingInitializer(fundingDto, {
            calculateCharges: this._dep.calculateCharges,
            createTransaction: this._dep.createTransaction,
            generatePaymentLink: this._dep.generatePaymentLink,
            getBusinessWallet: this.getBusinessWalletByCurrency,
            getCurrency: this._dep.getCurrency,
            getOrCreateCustomer: this._dep.getOrCreateCustomer,
            getUniqueWallet: this.getUniqueWallet,
            getWalletById: this.getWalletById,
            getWalletChargeStack: this._dep.getWalletChargeStack,
            startSession: this._dep.repo.startSession,
        }).exec();

        return link;
    };

    incrementBalance: WalletServiceInterface["incrementBalance"] = async (data) => {
        await this._repo.incrementBalance(data);
    };

    resolveTransaction: WalletServiceInterface["resolveTransaction"] = async (data) => {
        const resolver = new TransactionResolver({
            imdsService: this._dep.imdsService,
            calculateCharges: this._dep.calculateCharges,
            createTransaction: this._dep.createTransaction,
            findTransactionByReference: this._dep.findTransactionByReference,
            getBusinessWallet: this.getBusinessWalletByCurrency,
            getCurrency: this._dep.getCurrency,
            getOrCreateCustomer: this._dep.getOrCreateCustomer,
            getWalletById: this.getWalletById,
            getWalletChargeStack: this._dep.getWalletChargeStack,
            incrementWalletBalance: this.incrementBalance,
            provider: data.provider,
            reference: data.reference,
            startSession: this._repo.startSession,
            updateTransactionInfo: this._dep.updateTransactionInfo,
            verifyTransactionFromProvider: this._dep.verifyTransactionFromProvider,
            updateCustomer: this._dep.updateCustomer,
        });
        await resolver.exec();
    };

    dequeueTransaction: WalletServiceInterface["dequeueTransaction"] = async (msg) => {
        const data = new TransactionMessageDto(msg as TransactionMessageDto);
        try {
            await this.resolveTransaction(new ResolveTransactionDto(data));
        } catch (err) {
            if (err instanceof TransactionResolutionError) {
                if (err.critical) throw err;
                return;
            }

            throw err;
        }
    };
}