import { CreateCustomerDto, CustomerModelInterface, CustomerRepoInterface } from "@logic/customer";
import { Customer } from "./customer.model";

export class CustomerRepo implements CustomerRepoInterface {
    constructor(private readonly _modelContext: typeof Customer) {}

    create = async (createCustomerDto: CreateCustomerDto) => {
        const customer = await this._modelContext.create(createCustomerDto);
        return customer.toJSON();
    };

    getByBusinessId = async (businessId: CustomerModelInterface["businessId"]) => {
        const customers = await this._modelContext.findAll({ where: { businessId } });
        return customers.map((customer) => customer.toJSON());
    };
}
