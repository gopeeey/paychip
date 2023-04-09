import { SessionInterface } from "@logic/session_interface";
import { CreateAccountDto } from "../dtos";
import { AccountModelInterface } from "./accounts.model.interface";
import { Pool, PoolClient } from "pg";

export interface AccountRepoInterface {
    create: (
        createAccountDto: CreateAccountDto,
        client?: PoolClient
    ) => Promise<AccountModelInterface>;

    findByEmail: (email: string, client?: PoolClient) => Promise<AccountModelInterface | null>;

    findById: (
        id: AccountModelInterface["id"],
        client?: PoolClient
    ) => Promise<AccountModelInterface | null>;
}
