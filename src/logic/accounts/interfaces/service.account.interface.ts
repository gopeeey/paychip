import { CreateAccountDto, LoginDto } from "../dtos";
import { AccountModelInterface } from "./accounts.model.interface";
import { AccountRepoInterface } from "./accounts.repo.interface";

export interface AccountServiceInterface {
    createAccount: (createAccountDto: CreateAccountDto) => Promise<AccountModelInterface>;
    signup: (
        createAccountDto: CreateAccountDto
    ) => Promise<{ account: AccountModelInterface; authToken: string }>;
    login: (loginDto: LoginDto) => Promise<{ account: AccountModelInterface; authToken: string }>;

    getById: (id: AccountModelInterface["id"]) => Promise<AccountModelInterface>;
}

export interface AccountServiceDependenciesInterface {
    repo: AccountRepoInterface;
}
