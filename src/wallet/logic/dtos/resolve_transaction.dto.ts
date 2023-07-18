type ArgsType = {
    reference: string;
    provider: string;
};

export class ResolveTransactionDto {
    reference: ArgsType["reference"];
    provider: ArgsType["provider"];

    constructor({ reference, provider }: ArgsType) {
        this.reference = reference;
        this.provider = provider;
    }
}
