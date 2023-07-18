import { CustomerModelInterface } from "../interfaces";

type Props = Pick<CustomerModelInterface, "id" | "name" | "firstName" | "lastName" | "phone">;

export class UpdateCustomerDto implements Props {
    id: Props["id"];
    name: Props["name"];
    firstName: Props["firstName"];
    lastName: Props["lastName"];
    phone: Props["phone"];

    constructor(body: Props) {
        this.id = body.id;
        this.name = body.name;
        this.firstName = body.firstName;
        this.lastName = body.lastName;
        this.phone = body.phone;
    }
}
