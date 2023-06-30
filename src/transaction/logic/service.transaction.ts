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

    findTransactionByReference: TransactionServiceInterface["findTransactionByReference"] = async (
        reference
    ) => {
        const transaction = await this._repo.getByReference(reference);
        return transaction;
    };

    updateTransactionStatus: TransactionServiceInterface["updateTransactionStatus"] = async (
        id,
        status,
        session
    ) => {
        await this._repo.updateStatus(id, status, session);
    };

    updateTransactionInfo: TransactionServiceInterface["updateTransactionInfo"] = async (
        transactionId,
        info,
        session
    ) => {
        await this._repo.updateTransactionInfo(transactionId, info, session);
    };
}
