import { CustomerModelInterface } from "../interfaces";

type requiredProps = Pick<
    CustomerModelInterface,
    "email" | "businessId" | "name" | "phone" | "firstName" | "lastName"
>;

export class CreateCustomerDto implements requiredProps {
    email: CustomerModelInterface["email"];
    businessId: CustomerModelInterface["businessId"];
    name?: CustomerModelInterface["name"];
    phone?: CustomerModelInterface["phone"];
    firstName?: CustomerModelInterface["firstName"];
    lastName?: CustomerModelInterface["lastName"];

    constructor(body: requiredProps) {
        this.email = body.email;
        this.businessId = body.businessId;
        this.name = body.name;
        this.phone = body.phone;
        this.firstName = body.firstName;
        this.lastName = body.lastName;
    }
}
