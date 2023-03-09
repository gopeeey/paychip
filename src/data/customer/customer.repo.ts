import { CreateCustomerDto, CustomerModelInterface, CustomerRepoInterface } from "@logic/customer";
import { Transaction } from "sequelize";
import { generateId } from "src/utils";
import { Customer } from "./customer.model";

export class CustomerRepo implements CustomerRepoInterface {
    constructor(private readonly _modelContext: typeof Customer) {}

    create: CustomerRepoInterface["create"] = async (dto, session) => {
        const customer = await this._modelContext.create(
            { ...dto, id: generateId() },
            {
                transaction: session as Transaction,
            }
        );
        return customer.toJSON();
    };

    getByBusinessId = async (businessId: CustomerModelInterface["businessId"]) => {
        const customers = await this._modelContext.findAll({ where: { businessId } });
        return customers.map((customer) => customer.toJSON());
    };
}
