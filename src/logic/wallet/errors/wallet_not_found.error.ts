import { NotFoundError } from "@logic/base_errors";
import { WalletModelInterface } from "../interfaces";
import { GetUniqueWalletDto } from "../dtos";

type LoggedDataType = WalletModelInterface["id"] | GetUniqueWalletDto | undefined;

export class WalletNotFoundError extends NotFoundError<undefined, LoggedDataType> {
    constructor(queryData?: LoggedDataType) {
        super("Wallet not found", undefined, queryData);
    }
}
