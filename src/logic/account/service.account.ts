import { AccountModelInterface, AccountServiceDependenciesInterface } from "./interfaces";
import { CreateAccountDto } from "./dtos";
import { hashString, generateAuthToken } from "src/utils";
import { LoginDto } from "./dtos";
import {
    InvalidLoginDetailsError,
    EmailAlreadyRegisteredError,
    AccountNotFoundError,
} from "./errors";
import { AccountServiceInterface } from "./interfaces";
import bcrypt from "bcrypt";

export class AccountService implements AccountServiceInterface {
    private readonly _repository: AccountServiceDependenciesInterface["repo"];

    constructor(private readonly _dependencies: AccountServiceDependenciesInterface) {
        this._repository = this._dependencies.repo;
    }

    createAccount = async (createAccountDto: CreateAccountDto) => {
        const { email, password } = createAccountDto;
        // check if email is already registered
        const existing = await this._repository.findByEmail(email);
        if (existing) throw new EmailAlreadyRegisteredError();

        // hash password
        const passwordHash = await hashString(password);
        const newCreateAccountDto = new CreateAccountDto({
            ...createAccountDto,
            password: passwordHash,
        });

        // persist account
        const account = await this._repository.create(newCreateAccountDto);
        return account;
    };

    signup = async (createAccountDto: CreateAccountDto) => {
        // const {email, password, name} = createAccountDto;
        const account = await this.createAccount(createAccountDto);
        const authToken = generateAuthToken("account", { accountId: account.id });
        return { account, authToken };
    };

    login = async (loginDto: LoginDto) => {
        const { email, password } = loginDto;
        const account = await this._repository.findByEmail(email);
        if (!account) throw new InvalidLoginDetailsError();
        const passMatch = await bcrypt.compare(password, account.password);
        if (!passMatch) throw new InvalidLoginDetailsError();
        const authToken = generateAuthToken("account", { accountId: account.id });

        return { account, authToken };
    };

    getById = async (id: AccountModelInterface["id"]) => {
        const account = await this._repository.findById(id);
        if (!account) throw new AccountNotFoundError();
        return account;
    };
}
