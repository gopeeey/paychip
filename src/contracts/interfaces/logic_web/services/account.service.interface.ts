import { CreateAccountDto, LoginDto, StandardAccountDto } from "../../../dtos";

export interface AccountServiceInterface {
    createAccount: (createAccountDto: CreateAccountDto) => Promise<StandardAccountDto>;
    signup: (
        createAccountDto: CreateAccountDto
    ) => Promise<{ account: StandardAccountDto; authToken: string }>;
    login: (loginDto: LoginDto) => Promise<{ account: StandardAccountDto; authToken: string }>;
}
