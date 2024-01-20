import { SessionInterface } from "@bases/logic";
import { CreateTransactionDto, PreVerifyTransferDto, UpdateTransactionInfoDto } from "../dtos";
import { TransactionModelInterface } from "./transaction.model.interface";
import { TransactionRepoInterface } from "./transaction_repo.interface";
import { TransactionStatusType } from "./transaction.def.model.interface";
import { TransferQueueInterface, VerifyTransferQueueInterface } from "@queues/transfers";
import { PaymentProviderServiceInterface, VerifyTransferDto } from "@payment_providers/logic";

export interface TransactionServiceInterface {
    createTransaction: (
        createTransactionDto: CreateTransactionDto,
        session?: SessionInterface
    ) => Promise<TransactionModelInterface>;

    findTransactionByReference: (reference: string) => Promise<TransactionModelInterface | null>;

    findTransactionByRefAndStatus: (
        reference: string,
        status: TransactionStatusType
    ) => Promise<TransactionModelInterface | null>;

    getTransactionByReference: (reference: string) => Promise<TransactionModelInterface>;

    updateTransactionReference: (
        id: TransactionModelInterface["id"],
        reference: TransactionModelInterface["reference"],
        session?: SessionInterface
    ) => Promise<void>;

    updateTransactionInfo: (
        id: TransactionModelInterface["id"],
        info: UpdateTransactionInfoDto,
        session?: SessionInterface
    ) => Promise<void>;

    enqueueTransfersForVerification: (callback?: () => void) => Promise<void>;

    dequeueTransferVerificationTask: (dto: VerifyTransferDto) => Promise<void>;

    retryTransfers: (callback?: () => void) => Promise<void>;
}

export interface TransactionServiceDependencies {
    repo: TransactionRepoInterface;
    publishTransfer: TransferQueueInterface["publish"];
    publishTransfersForVerification: VerifyTransferQueueInterface["publish"];
    verifyTransfer: PaymentProviderServiceInterface["verifyTransfer"];
}
