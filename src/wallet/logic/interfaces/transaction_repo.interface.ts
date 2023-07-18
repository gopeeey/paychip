import { SessionInterface } from "@bases/logic";
import { CreateTransactionDto, UpdateTransactionInfoDto } from "../dtos";
import { TransactionModelInterface } from "./transaction.model.interface";
import { TransactionStatusType } from "./transaction.def.model.interface";

export interface TransactionRepoInterface {
    create: (
        createTransactionDto: CreateTransactionDto,
        session?: SessionInterface
    ) => Promise<TransactionModelInterface>;

    getByReference: (
        reference: string,
        session?: SessionInterface
    ) => Promise<TransactionModelInterface | null>;

    getByRefAndStatus: (
        reference: string,
        status: TransactionStatusType,
        session?: SessionInterface
    ) => Promise<TransactionModelInterface | null>;

    updateStatus: (
        transactionId: TransactionModelInterface["id"],
        status: TransactionModelInterface["status"],
        session?: SessionInterface
    ) => Promise<void>;

    updateTransactionInfo: (
        transactionId: TransactionModelInterface["id"],
        data: UpdateTransactionInfoDto,
        session?: SessionInterface
    ) => Promise<void>;

    startSession: () => Promise<SessionInterface>;
}
