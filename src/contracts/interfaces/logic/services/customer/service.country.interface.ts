import { CreateCustomerDto } from "../../../../dtos";
import { BusinessModelInterface, CustomerModelInterface, CustomerRepoInterface } from "../../../db";

export interface CustomerServiceInterface {
    createCustomer: (createCustomerDto: CreateCustomerDto) => Promise<CustomerModelInterface>;
    getBusinessCustomers: (
        businessId: BusinessModelInterface["id"]
    ) => Promise<CustomerModelInterface[]>;
}

export interface CustomerServiceDependencies {
    repo: CustomerRepoInterface;
}
