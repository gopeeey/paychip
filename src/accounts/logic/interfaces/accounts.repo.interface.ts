import { SessionInterface } from "@bases/logic";
import { CreateAccountDto } from "../dtos";
import { AccountModelInterface } from "./accounts.model.interface";
import { BaseRepoInterface } from "@bases/logic";

export interface AccountRepoInterface extends BaseRepoInterface {
    create: (
        createAccountDto: CreateAccountDto,
        session?: SessionInterface
    ) => Promise<AccountModelInterface>;

    findByEmail: (
        email: string,
        session?: SessionInterface
    ) => Promise<AccountModelInterface | null>;

    findById: (
        id: AccountModelInterface["id"],
        session?: SessionInterface
    ) => Promise<AccountModelInterface | null>;
}
