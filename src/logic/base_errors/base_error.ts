export class BaseError<D, L> extends Error {
    declare data?: D;
    declare logData?: L;
    constructor(message?: string, logData?: L, data?: D) {
        super(message);
        this.data = data;
        this.logData = logData;
    }
}
