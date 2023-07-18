import { SessionInterface } from "@bases/logic";
import { CreateCustomerDto, GetSingleBusinessCustomerDto, UpdateCustomerDto } from "../dtos";
import { CustomerModelInterface } from "./customer.model.interface";
import { CustomerRepoInterface } from "./customer.repo.interface";

export interface CustomerServiceInterface {
    createCustomer: (createCustomerDto: CreateCustomerDto) => Promise<CustomerModelInterface>;
    getBusinessCustomers: (
        businessId: CustomerModelInterface["businessId"]
    ) => Promise<CustomerModelInterface[]>;

    getOrCreateCustomer: (dto: GetSingleBusinessCustomerDto) => Promise<CustomerModelInterface>;
    updateCustomer: (dto: UpdateCustomerDto, session?: SessionInterface) => Promise<void>;
}

export interface CustomerServiceDependencies {
    repo: CustomerRepoInterface;
}
