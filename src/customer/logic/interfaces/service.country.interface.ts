import { CreateCustomerDto, GetSingleBusinessCustomerDto } from "../dtos";
import { CustomerModelInterface } from "./customer.model.interface";
import { CustomerRepoInterface } from "./customer.repo.interface";

export interface CustomerServiceInterface {
    createCustomer: (createCustomerDto: CreateCustomerDto) => Promise<CustomerModelInterface>;
    getBusinessCustomers: (
        businessId: CustomerModelInterface["businessId"]
    ) => Promise<CustomerModelInterface[]>;

    getOrCreateCustomer: (dto: GetSingleBusinessCustomerDto) => Promise<CustomerModelInterface>;
}

export interface CustomerServiceDependencies {
    repo: CustomerRepoInterface;
}
