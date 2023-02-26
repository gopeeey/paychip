import { CreateCustomerDto } from "./dtos";
import {
    CustomerServiceInterface,
    CustomerServiceDependencies,
    CustomerModelInterface,
} from "./interfaces";

export class CustomerService implements CustomerServiceInterface {
    private declare readonly _repo: CustomerServiceDependencies["repo"];
    constructor(private readonly _dependencies: CustomerServiceDependencies) {
        this._repo = this._dependencies.repo;
    }

    createCustomer = async (createCustomerDto: CreateCustomerDto) => {
        const customer = await this._repo.create(createCustomerDto);
        return customer;
    };

    getBusinessCustomers = async (businessId: CustomerModelInterface["businessId"]) => {
        const customers = await this._repo.getByBusinessId(businessId);
        return customers;
    };
}
