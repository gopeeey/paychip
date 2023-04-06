import { AccountModelInterface, AccountRepoInterface, CreateAccountDto } from "@logic/account";
import { accountJson } from "src/__tests__/samples";
import { pool } from "@data/db";

export class AccountRepo implements AccountRepoInterface {
    create: AccountRepoInterface["create"] = async (createAccountDto) => {
        return accountJson;
    };

    findByEmail: AccountRepoInterface["findByEmail"] = async (email) => {
        return accountJson;
    };

    findById: AccountRepoInterface["findById"] = async (id) => {
        return accountJson;
    };
}
