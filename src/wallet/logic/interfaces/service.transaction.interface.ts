import { SessionInterface } from "@bases/logic";
import { CreateTransactionDto, PreVerifyTransferDto, UpdateTransactionInfoDto } from "../dtos";
import { TransactionModelInterface } from "./transaction.model.interface";
import { TransactionRepoInterface } from "./transaction_repo.interface";
import { TransactionStatusType } from "./transaction.def.model.interface";

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

    getPendingDebitTransactionsThatHaveProviderRef: () => Promise<PreVerifyTransferDto[]>;
}

export interface TransactionServiceDependencies {
    repo: TransactionRepoInterface;
}
