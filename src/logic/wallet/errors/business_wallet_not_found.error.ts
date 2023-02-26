import { WalletModelInterface } from "../interfaces";
import { InternalError } from "@logic/base_errors";

interface LogData {
    businessId: WalletModelInterface["businessId"];
    currency: WalletModelInterface["currency"];
}

export class BusinessRootWalletNotFoundError extends InternalError<LogData> {
    constructor(businessId: LogData["businessId"], currency: LogData["currency"]) {
        super("Business primary wallet not found", { businessId, currency });
    }
}
