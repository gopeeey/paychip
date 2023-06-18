import { InternalError } from "@bases/logic";

type ArgsType = {
    message?: string;
    logData?: unknown;
};
export class GeneratePaymentLinkError extends InternalError<unknown> {
    constructor(body: ArgsType) {
        super(body.message, body.logData);
        this.name = "Generate Payment Link Error";
    }
}
