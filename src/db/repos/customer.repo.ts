import { CreateCustomerDto } from "../../contracts/dtos";
import { BusinessModelInterface, CustomerModelInterface } from "../../contracts/interfaces";
import { CustomerRepoInterface } from "../../contracts/interfaces/db/repos/customer.repo.interface";
import { Customer } from "../models/customer.model";

export class CustomerRepo implements CustomerRepoInterface {
    constructor(private readonly _modelContext: typeof Customer) {}

    async create(createCustomerDto: CreateCustomerDto) {
        const customer = await this._modelContext.create(createCustomerDto);
        return customer.toJSON();
    }

    async getByBusinessId(businessId: BusinessModelInterface["id"]) {
        const customers = await this._modelContext.findAll({ where: { businessId } });
        return customers.map((customer) => customer.toJSON());
    }
}
