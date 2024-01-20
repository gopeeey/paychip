import { SessionInterface } from "@bases/logic";
import { CreateTransactionDto, PreVerifyTransferDto, UpdateTransactionInfoDto } from "../dtos";
import { TransactionModelInterface } from "./transaction.model.interface";
import { TransactionStatusType } from "./transaction.def.model.interface";

export interface TransactionRepoInterface {
    create: (
        createTransactionDto: CreateTransactionDto,
        session?: SessionInterface
    ) => Promise<TransactionModelInterface>;

    createMultiple: (
        createTransactionDtos: CreateTransactionDto[],
        session?: SessionInterface
    ) => Promise<TransactionModelInterface[]>;

    getByReference: (
        reference: string,
        session?: SessionInterface
    ) => Promise<TransactionModelInterface | null>;

    getByRefAndStatus: (
        reference: string,
        status: TransactionStatusType,
        session?: SessionInterface
    ) => Promise<TransactionModelInterface | null>;

    updateReference: (
        transactionId: TransactionModelInterface["id"],
        reference: TransactionModelInterface["reference"],
        session?: SessionInterface
    ) => Promise<void>;

    updateTransactionInfo: (
        transactionId: TransactionModelInterface["id"],
        data: UpdateTransactionInfoDto,
        session?: SessionInterface
    ) => Promise<void>;

    updateForRetrial: (
        transactionId: TransactionModelInterface["id"],
        retrialDate: Date,
        session?: SessionInterface
    ) => Promise<void>;

    getPendingDebitThatHaveProviderRef: () => Promise<PreVerifyTransferDto[]>;

    getRetryTransfers: () => Promise<TransactionModelInterface[]>;

    startSession: () => Promise<SessionInterface>;
}
