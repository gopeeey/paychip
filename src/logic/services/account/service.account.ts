import { AccountServiceDependenciesInterface } from "../../../contracts/interfaces";
import { CreateAccountDto, StandardAccountDto } from "../../../contracts/dtos";
import { hashString, generateAuthToken } from "../../../utils/functions";
import { LoginDto } from "../../../contracts/dtos";
import { InvalidLoginDetailsError, EmailAlreadyRegisteredError } from "../../errors";
import { AccountServiceInterface } from "../../../contracts/interfaces";
import bcrypt from "bcrypt";

export class AccountService implements AccountServiceInterface {
    private readonly _repository: AccountServiceDependenciesInterface["repo"];

    constructor(private readonly _dependencies: AccountServiceDependenciesInterface) {
        this._repository = this._dependencies.repo;
    }

    async createAccount(createAccountDto: CreateAccountDto) {
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
        const profile = await this._repository.create(newCreateAccountDto);
        return new StandardAccountDto(profile);
    }

    async signup(createAccountDto: CreateAccountDto) {
        // const {email, password, name} = createAccountDto;
        const account = await this.createAccount(createAccountDto);
        const authToken = generateAuthToken("account", { accountId: account.id });
        return { account, authToken };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const account = await this._repository.findByEmail(email);
        if (!account) throw new InvalidLoginDetailsError();
        const passMatch = await bcrypt.compare(password, account.password);
        if (!passMatch) throw new InvalidLoginDetailsError();
        const authToken = generateAuthToken("account", { accountId: account.id });

        return { account: new StandardAccountDto(account), authToken };
    }
}
