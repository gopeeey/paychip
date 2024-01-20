type Props = {
    status: "successful" | "failed" | "pending" | "not_found";
    providerRef?: string | null;
};

export class VerifyTransferResponseDto implements Props {
    status: Props["status"];
    providerRef: Props["providerRef"];

    constructor(body: Props) {
        this.status = body.status;
        this.providerRef = body.providerRef;
    }
}
