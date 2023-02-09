import { CreateCustomerDto, StandardCustomerDto } from "../../../contracts/dtos";
import {
    CustomerServiceInterface,
    CustomerServiceDependencies,
    BusinessModelInterface,
} from "../../../contracts/interfaces";

export class CustomerService implements CustomerServiceInterface {
    private declare readonly _repo: CustomerServiceDependencies["repo"];
    constructor(private readonly _dependencies: CustomerServiceDependencies) {
        this._repo = this._dependencies.repo;
    }

    createCustomer = async (createCustomerDto: CreateCustomerDto) => {
        const customer = await this._repo.create(createCustomerDto);
        return new StandardCustomerDto(customer);
    };

    getBusinessCustomers = async (businessId: BusinessModelInterface["id"]) => {
        const customers = await this._repo.getByBusinessId(businessId);
        return customers.map((customer) => new StandardCustomerDto(customer));
    };
}
