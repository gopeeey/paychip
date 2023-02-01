import { CreateCustomerDto } from "../../../dtos";
import { BusinessModelInterface, CustomerModelInterface } from "../models";

export interface CustomerRepoInterface {
    create: (dto: CreateCustomerDto) => Promise<CustomerModelInterface>;

    getByBusinessId: (
        businessId: BusinessModelInterface["id"]
    ) => Promise<CustomerModelInterface[]>;
}
