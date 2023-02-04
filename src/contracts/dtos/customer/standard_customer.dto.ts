import { CustomerModelInterface } from "../../interfaces";

export class StandardCustomerDto implements CustomerModelInterface {
    id: CustomerModelInterface["id"];
    email: CustomerModelInterface["email"];
    businessId: CustomerModelInterface["businessId"];
    name: CustomerModelInterface["name"];
    phone: CustomerModelInterface["phone"];
    createdAt: CustomerModelInterface["createdAt"];

    constructor(body: CustomerModelInterface) {
        this.id = body.id;
        this.email = body.email;
        this.businessId = body.businessId;
        this.name = body.name;
        this.phone = body.phone;
        this.createdAt = body.createdAt;
    }
}
