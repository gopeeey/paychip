import { CustomerModelInterface } from "../../interfaces";

type requiredProps = Pick<CustomerModelInterface, "email" | "businessId" | "name" | "phone">;

export class CreateCustomerDto implements requiredProps {
    email: CustomerModelInterface["email"];
    businessId: CustomerModelInterface["businessId"];
    name: CustomerModelInterface["name"];
    phone: CustomerModelInterface["phone"];

    constructor(body: requiredProps) {
        this.email = body.email;
        this.businessId = body.businessId;
        this.name = body.name;
        this.phone = body.phone;
    }
}
