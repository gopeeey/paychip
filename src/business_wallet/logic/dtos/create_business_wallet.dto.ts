import { BusinessWalletModelInterface } from "../interfaces";

type RequiredProps = Pick<BusinessWalletModelInterface, "businessId" | "currencyCode">;

export class CreateBusinessWalletDto implements RequiredProps {
    businessId: RequiredProps["businessId"];
    currencyCode: RequiredProps["currencyCode"];

    constructor(body: RequiredProps) {
        this.businessId = body.businessId;
        this.currencyCode = body.currencyCode;
    }
}
