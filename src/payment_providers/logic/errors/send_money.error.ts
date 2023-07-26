import { InternalError } from "@bases/logic";
import { SendMoneyDto } from "../dtos";

type LogDataType = {
    provider: string;
    dto: SendMoneyDto;
};

export class SendMoneyError extends InternalError<LogDataType> {
    constructor(message: string, provider: LogDataType["provider"], dto: LogDataType["dto"]) {
        super(`Error sending money via ${provider}: ${message}`, { provider, dto });
        this.name = "SendMoneyError";
    }
}
