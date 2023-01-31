import { CreateCustomerDto } from "../../../dtos";
import { CustomerModelInterface } from "../models";

export interface CustomerRepoInterface {
    create: (dto: CreateCustomerDto) => Promise<CustomerModelInterface>;
}
