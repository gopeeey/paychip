import { SessionInterface } from "@bases/logic";
import { CreateTransactionDto } from "../dtos";
import { TransactionModelInterface } from "./transaction.model.interface";

export interface TransactionRepoInterface {
    create: (
        createTransactionDto: CreateTransactionDto,
        session?: SessionInterface
    ) => Promise<TransactionModelInterface>;
}
