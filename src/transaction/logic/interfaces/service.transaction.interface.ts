import { SessionInterface } from "@bases/logic";
import { CreateTransactionDto, UpdateTransactionInfoDto } from "../dtos";
import { TransactionModelInterface } from "./transaction.model.interface";
import { TransactionRepoInterface } from "./transaction_repo.interface";

export interface TransactionServiceInterface {
    createTransaction: (
        createTransactionDto: CreateTransactionDto,
        session?: SessionInterface
    ) => Promise<TransactionModelInterface>;

    findTransactionByReference: (reference: string) => Promise<TransactionModelInterface | null>;

    updateTransactionStatus: (
        id: TransactionModelInterface["id"],
        status: TransactionModelInterface["status"],
        session?: SessionInterface
    ) => Promise<void>;

    updateTransactionInfo: (
        id: TransactionModelInterface["id"],
        info: UpdateTransactionInfoDto,
        session?: SessionInterface
    ) => Promise<void>;
}

export interface TransactionServiceDependencies {
    repo: TransactionRepoInterface;
}
