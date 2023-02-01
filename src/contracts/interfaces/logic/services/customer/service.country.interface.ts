import { CreateCustomerDto, StandardCustomerDto } from "../../../../dtos";
import { BusinessModelInterface, CustomerModelInterface, CustomerRepoInterface } from "../../../db";

export interface CustomerServiceInterface {
    createCustomer: (createCustomerDto: CreateCustomerDto) => Promise<StandardCustomerDto>;
    getBusinessCustomers: (
        businessId: BusinessModelInterface["id"]
    ) => Promise<StandardCustomerDto[]>;
}

export interface CustomerServiceDependencies {
    repo: CustomerRepoInterface;
}
