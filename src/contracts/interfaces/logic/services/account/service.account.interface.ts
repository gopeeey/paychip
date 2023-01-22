import { CreateAccountDto, LoginDto, StandardAccountDto } from "../../../../dtos";
import { AccountRepoInterface } from "../../../db";

export interface AccountServiceInterface {
    createAccount: (createAccountDto: CreateAccountDto) => Promise<StandardAccountDto>;
    signup: (
        createAccountDto: CreateAccountDto
    ) => Promise<{ account: StandardAccountDto; authToken: string }>;
    login: (loginDto: LoginDto) => Promise<{ account: StandardAccountDto; authToken: string }>;
}

export interface AccountServiceDependenciesInterface {
    repo: AccountRepoInterface;
}
