import { SessionInterface } from "@bases/logic";
import { CreateCustomerDto, GetSingleBusinessCustomerDto, UpdateCustomerDto } from "./dtos";
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

    createCustomer: CustomerServiceInterface["createCustomer"] = async (
        createCustomerDto: CreateCustomerDto
    ) => {
        const customer = await this._repo.create(createCustomerDto);
        return customer;
    };

    getBusinessCustomers: CustomerServiceInterface["getBusinessCustomers"] = async (
        businessId: CustomerModelInterface["businessId"]
    ) => {
        const customers = await this._repo.getByBusinessId(businessId);
        return customers;
    };

    getOrCreateCustomer: CustomerServiceInterface["getOrCreateCustomer"] = async (
        data: GetSingleBusinessCustomerDto
    ) => {
        const existing = await this._repo.getSingleBusinessCustomer(data);
        if (existing) return existing;
        const createDto = new CreateCustomerDto(data);
        const newCustomer = await this.createCustomer(createDto);
        return newCustomer;
    };

    updateCustomer: CustomerServiceInterface["updateCustomer"] = async (data, session) => {
        await this._repo.updateCustomer(data, session);
    };
}
