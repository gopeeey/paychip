import { TransactionModelInterface } from "../interfaces";

interface Props extends Pick<TransactionModelInterface, "id" | "reference"> {
    provider: Exclude<TransactionModelInterface["provider"], null | undefined>;
    providerRef: Exclude<TransactionModelInterface["providerRef"], null | undefined>;
}

export class PreVerifyTransferDto implements Props {
    id: Props["id"];
    reference: Props["reference"];
    provider: Props["provider"];
    providerRef: Props["providerRef"];

    constructor(body: Props) {
        this.id = body.id;
        this.reference = body.reference;
        this.provider = body.provider;
        this.providerRef = body.providerRef;
    }
}
