import { SessionInterface } from "@logic/session_interface";
import { CreateAccountDto } from "../dtos";
import { AccountModelInterface } from "./accounts.model.interface";

export interface AccountRepoInterface {
    create: (
        createAccountDto: CreateAccountDto,
        session?: SessionInterface
    ) => Promise<AccountModelInterface>;

    findByEmail: (email: string) => Promise<AccountModelInterface | null>;

    findById: (id: AccountModelInterface["id"]) => Promise<AccountModelInterface | null>;
}
