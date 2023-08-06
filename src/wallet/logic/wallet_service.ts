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
import { ResolveTransactionDto, UpdateTransactionInfoDto } from "./dtos";
import { SendMoneyDto, VerifyTransferDto } from "@payment_providers/logic";
import { InternalError } from "@bases/logic";
import config from "src/config";

export class WalletService implements WalletServiceInterface {
    private _repo: WalletRepoInterface;

    constructor(private readonly _deps: WalletServiceDependencies) {
        this._repo = this._deps.repo;
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

    getWalletByIdWithBusinessWallet: WalletServiceInterface["getWalletByIdWithBusinessWallet"] =
        async (id) => {
            const wallet = await this._repo.getByIdWithBusinessWallet(id);
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
            calculateCharges: this._deps.calculateCharges,
            createTransaction: this._deps.createTransaction,
            generatePaymentLink: this._deps.generatePaymentLink,
            getBusinessWallet: this.getBusinessWalletByCurrency,
            getCurrency: this._deps.getCurrency,
            getOrCreateCustomer: this._deps.getOrCreateCustomer,
            getUniqueWallet: this.getUniqueWallet,
            getWalletById: this.getWalletById,
            getWalletChargeStack: this._deps.getWalletChargeStack,
            startSession: this._deps.repo.startSession,
        }).exec();

        return link;
    };

    incrementBalance: WalletServiceInterface["incrementBalance"] = async (data) => {
        await this._repo.incrementBalance(data);
    };

    resolveTransaction: WalletServiceInterface["resolveTransaction"] = async (data) => {
        const resolver = new TransactionResolver({
            imdsService: this._deps.imdsService,
            calculateCharges: this._deps.calculateCharges,
            createTransaction: this._deps.createTransaction,
            findTransactionByReference: this._deps.findTransactionByReference,
            getBusinessWallet: this.getBusinessWalletByCurrency,
            getCurrency: this._deps.getCurrency,
            getOrCreateCustomer: this._deps.getOrCreateCustomer,
            getWalletByIdWithBusinessWallet: this.getWalletByIdWithBusinessWallet,
            getWalletChargeStack: this._deps.getWalletChargeStack,
            incrementWalletBalance: this.incrementBalance,
            provider: data.provider,
            reference: data.reference,
            startSession: this._repo.startSession,
            updateTransactionInfo: this._deps.updateTransactionInfo,
            verifyTransactionFromProvider: this._deps.verifyTransactionFromProvider,
            updateCustomer: this._deps.updateCustomer,
            sendEmail: this._deps.sendEmail,
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

    dequeueTransfer: WalletServiceInterface["dequeueTransfer"] = async (msg) => {
        const { amount, bankDetails, currencyCode, provider, reference } = msg;

        // Fetch the transaction
        const transaction = await this._deps.getTransactionByReference(reference);

        // Verify the transaction from the provider
        const verificationRes = await this._deps.verifyTransferFromProvider(
            new VerifyTransferDto({
                reference,
                provider,
            })
        );

        let providerRef: string = "",
            sendRef: string = reference;
        let toSend = false;
        switch (verificationRes.status) {
            case "pending":
                if (!verificationRes.providerRef)
                    throw new InternalError(
                        `Transfer status ${verificationRes.status} without providerRef`,
                        { message: msg, verificationRes }
                    );
                providerRef = verificationRes.providerRef;
                toSend = false;
                break;

            case "successful":
                if (!verificationRes.providerRef)
                    throw new InternalError(
                        `Transfer status ${verificationRes.status} without providerRef`,
                        { message: msg, verificationRes }
                    );
                providerRef = verificationRes.providerRef;
                toSend = false;
                break;

            case "failed":
                sendRef += config.payment.transferRetrialSuffix;
                await this._deps.updateTransactionReference(transaction.id, sendRef);
                toSend = true;
                break;
            case "not_found":
                sendRef = reference;
                toSend = true;
                break;
            default:
                throw new InternalError("Invalid transfer status", {
                    message: msg,
                    verificationRes,
                });
        }

        if (toSend) {
            try {
                providerRef = await this._deps.sendMoney(
                    new SendMoneyDto({
                        amount,
                        bankDetails,
                        currencyCode,
                        provider,
                        reference: sendRef,
                    })
                );
            } catch (err) {
                await this._deps.updateTransactionInfo(
                    transaction.id,
                    new UpdateTransactionInfoDto({
                        channel: "bank",
                        providerRef: config.payment.retryTempProviderRef,
                        status: "pending",
                    })
                );
                throw err;
            }
        }

        await this._deps.updateTransactionInfo(
            transaction.id,
            new UpdateTransactionInfoDto({ channel: "bank", providerRef, status: "pending" })
        );
    };
}
