import { TransactionModelInterface } from "@wallet/logic";

type Props = {
    reference: TransactionModelInterface["reference"];
    provider: Exclude<TransactionModelInterface["provider"], null | undefined>;
};

export class VerifyTransferDto implements Props {
    reference: Props["reference"];
    provider: Props["provider"];

    constructor(body: Props) {
        this.reference = body.reference;
        this.provider = body.provider;
    }
}
