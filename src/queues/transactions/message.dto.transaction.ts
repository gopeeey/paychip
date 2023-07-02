type RequiredProps = {
    reference: string;
    provider: string;
};

export class TransactionMessageDto {
    reference: RequiredProps["reference"];
    provider: RequiredProps["provider"];
    constructor({ reference, provider }: RequiredProps) {
        this.reference = reference;
        this.provider = provider;
    }
}
