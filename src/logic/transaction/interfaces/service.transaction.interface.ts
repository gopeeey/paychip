import { SessionInterface } from "@logic/session_interface";
import { CreateTransactionDto } from "../dtos";
import { TransactionModelInterface } from "./transaction.model.interface";
import { TransactionRepoInterface } from "./transaction_repo.interface";

export interface TransactionServiceInterface {
    createTransaction: (
        createTransactionDto: CreateTransactionDto,
        session?: SessionInterface
    ) => Promise<TransactionModelInterface>;
}

export interface TransactionServiceDependencies {
    repo: TransactionRepoInterface;
}
