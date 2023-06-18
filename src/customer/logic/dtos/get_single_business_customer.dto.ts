import { CustomerModelInterface } from "../interfaces";

interface RequiredProps {
    businessId: CustomerModelInterface["businessId"];
    email: CustomerModelInterface["email"];
}

export class GetSingleBusinessCustomerDto {
    businessId: CustomerModelInterface["businessId"];
    email: CustomerModelInterface["email"];

    constructor(body: RequiredProps) {
        this.businessId = body.businessId;
        this.email = body.email;
    }
}
