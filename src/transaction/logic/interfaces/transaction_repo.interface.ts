import { SessionInterface } from "@bases/logic";
import { CreateTransactionDto } from "../dtos";
import { TransactionModelInterface } from "./transaction.model.interface";

export interface TransactionRepoInterface {
    create: (
        createTransactionDto: CreateTransactionDto,
        session?: SessionInterface
    ) => Promise<TransactionModelInterface>;

    getByReference: (
        reference: string,
        session?: SessionInterface
    ) => Promise<TransactionModelInterface | null>;

    updateStatus: (
        transactionId: TransactionModelInterface["id"],
        status: TransactionModelInterface["status"],
        session?: SessionInterface
    ) => Promise<void>;

    startSession: () => Promise<SessionInterface>;
}
