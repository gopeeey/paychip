import { CreateCustomerDto } from "../dtos";
import { CustomerModelInterface } from "./customer.model.interface";

export interface CustomerRepoInterface {
    create: (dto: CreateCustomerDto) => Promise<CustomerModelInterface>;

    getByBusinessId: (
        businessId: CustomerModelInterface["businessId"]
    ) => Promise<CustomerModelInterface[]>;
}
