import { SessionInterface } from "@bases/logic";
import { CreateCustomerDto, GetSingleBusinessCustomerDto } from "../dtos";
import { CustomerModelInterface } from "./customer.model.interface";

export interface CustomerRepoInterface {
    create: (dto: CreateCustomerDto, session?: SessionInterface) => Promise<CustomerModelInterface>;

    getByBusinessId: (
        businessId: CustomerModelInterface["businessId"]
    ) => Promise<CustomerModelInterface[]>;

    getSingleBusinessCustomer: (
        dto: GetSingleBusinessCustomerDto
    ) => Promise<CustomerModelInterface | null>;
}
