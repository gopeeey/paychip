import { InternalError } from "@bases/logic";

export class BaseQueueError<L> extends InternalError<L> {
    constructor(message: string, logData?: L) {
        super(message, logData);
    }
}
