import {
    TransactionServiceDependencies,
    TransactionServiceInterface,
} from "./interfaces/service.transaction.interface";
import { TransactionNotFoundError } from "./errors";
import { BankDetails, VerifyTransferDto } from "@payment_providers/logic";
import config from "src/config";
import moment from "moment";
import { UpdateTransactionInfoDto } from "./dtos";
import { TransferMessageDto } from "@queues/transfers";

export class TransactionService implements TransactionServiceInterface {
    private readonly _repo: TransactionServiceDependencies["repo"];

    constructor(private readonly _deps: TransactionServiceDependencies) {
        this._repo = this._deps.repo;
    }

    createTransaction: TransactionServiceInterface["createTransaction"] = async (
        createTransactionDto,
        session
    ) => {
        const transaction = await this._repo.create(createTransactionDto, session);
        return transaction;
    };

    findTransactionByReference: TransactionServiceInterface["findTransactionByReference"] = async (
        reference
    ) => {
        const transaction = await this._repo.getByReference(reference);
        return transaction;
    };

    getTransactionByReference: TransactionServiceInterface["getTransactionByReference"] = async (
        reference
    ) => {
        const transaction = await this._repo.getByReference(reference);
        if (!transaction) throw new TransactionNotFoundError();
        return transaction;
    };

    findTransactionByRefAndStatus: TransactionServiceInterface["findTransactionByRefAndStatus"] =
        async (reference, status) => {
            const transaction = await this._repo.getByRefAndStatus(reference, status);
            return transaction;
        };

    updateTransactionReference: TransactionServiceInterface["updateTransactionReference"] = async (
        id,
        reference,
        session
    ) => {
        await this._repo.updateReference(id, reference, session);
    };

    updateTransactionInfo: TransactionServiceInterface["updateTransactionInfo"] = async (
        transactionId,
        info,
        session
    ) => {
        await this._repo.updateTransactionInfo(transactionId, info, session);
    };

    enqueueTransfersForVerification: TransactionServiceInterface["enqueueTransfersForVerification"] =
        async (callback) => {
            const transfers = await this._repo.getPendingDebitThatHaveProviderRef();
            for (const transfer of transfers) {
                await this._deps.publishTransfersForVerification(new VerifyTransferDto(transfer));
            }
            if (callback) callback();
        };

    dequeueTransferVerificationTask: TransactionServiceInterface["dequeueTransferVerificationTask"] =
        async (dto) => {
            const { reference, provider } = dto;
            const transaction = await this.getTransactionByReference(reference);

            const handleRetry = async () => {
                if (transaction.retries >= config.payment.maxRetries) {
                    const info = new UpdateTransactionInfoDto({
                        channel: "bank",
                        providerRef: transaction.providerRef,
                        status: "failed",
                    });
                    await this._repo.updateTransactionInfo(transaction.id, info);
                    return;
                } else {
                    const future = moment().add(config.payment.retrialInterval, "minutes");
                    await this._repo.updateForRetrial(transaction.id, future.toDate());
                    return;
                }
            };

            if (transaction.retries >= config.payment.maxRetries) return await handleRetry();
            if (transaction.providerRef === config.payment.retryTempProviderRef) {
                return await handleRetry();
            }

            const verifiedData = await this._deps.verifyTransfer(
                new VerifyTransferDto({
                    provider: transaction.provider as string,
                    reference: transaction.reference,
                })
            );

            switch (verifiedData.status) {
                case "successful":
                    const successInfo = new UpdateTransactionInfoDto({
                        status: "successful",
                        providerRef: verifiedData.providerRef,
                        channel: "bank",
                    });
                    return await this._repo.updateTransactionInfo(transaction.id, successInfo);
                case "failed":
                    return await handleRetry();
                default:
                    return;
            }
        };

    retryTransfers: TransactionServiceInterface["retryTransfers"] = async (callback) => {
        const transfers = await this._repo.getRetryTransfers();

        for (const transfer of transfers) {
            await this._repo.updateTransactionInfo(
                transfer.id,
                new UpdateTransactionInfoDto({
                    status: "pending",
                    channel: "bank",
                    providerRef: null,
                })
            );

            await this._deps.publishTransfer(
                new TransferMessageDto({
                    amount: transfer.settledAmount,
                    bankDetails: new BankDetails({
                        accountNumber: transfer.accountNumber as string,
                        accountName: transfer.accountName as string,
                        bankCode: transfer.bankCode as string,
                    }),
                    currencyCode: transfer.currency,
                    provider: transfer.provider as string,
                    reference: transfer.reference,
                })
            );
        }

        if (typeof callback === "function") callback();
    };
}
