import { SessionInterface } from "@logic/session_interface";
import { CreateCustomerDto } from "../dtos";
import { CustomerModelInterface } from "./customer.model.interface";

export interface CustomerRepoInterface {
    create: (dto: CreateCustomerDto, session?: SessionInterface) => Promise<CustomerModelInterface>;

    getByBusinessId: (
        businessId: CustomerModelInterface["businessId"]
    ) => Promise<CustomerModelInterface[]>;
}
