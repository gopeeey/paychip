import { NotFoundError } from "@bases/logic";
import { WalletModelInterface } from "../interfaces";
import { GetUniqueWalletDto } from "../dtos";

type BusinessWalletQueryType = {
    businessId: WalletModelInterface["businessId"];
    currency: WalletModelInterface["currency"];
};

type LoggedDataType =
    | WalletModelInterface["id"]
    | GetUniqueWalletDto
    | BusinessWalletQueryType
    | undefined;

export class WalletNotFoundError extends NotFoundError<undefined, LoggedDataType> {
    constructor(queryData?: LoggedDataType) {
        super("Wallet not found", undefined, queryData);
    }
}
