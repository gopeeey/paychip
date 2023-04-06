import {
    TransactionServiceDependencies,
    TransactionServiceInterface,
} from "./interfaces/service.transaction.interface";

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
}
