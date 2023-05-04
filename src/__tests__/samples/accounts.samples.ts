import {
    StandardAccountDto,
    LoginDto,
    CreateAccountDto,
    AccountModelInterface,
} from "@logic/accounts";
import { createAccountQuery } from "@data/accounts";
import { generateId } from "src/utils";
import { runQuery } from "@data/db";
import { Pool } from "pg";
import { SeedingError } from "../test_utils";

export const accountData: CreateAccountDto = {
    name: "Sam",
    email: "sammygopeh@gmail.com",
    password: "goldfish",
};

export const accountJson: AccountModelInterface = { ...accountData, id: "accountId" };
export const standardAccount = new StandardAccountDto(accountJson);
export const loginDetails = new LoginDto({
    email: accountData.email,
    password: accountData.password,
});

export const accountSeeder = async (pool: Pool) => {
    const data = { ...accountData, id: generateId() };
    const query = createAccountQuery(data);
    await runQuery(query, pool);
};

export const getAnAccount = async (pool: Pool) => {
    const query = "SELECT * FROM accounts LIMIT 1;";
    const res = await runQuery<AccountModelInterface>(query, pool);
    const account = res.rows[0];
    if (!account) throw new SeedingError("No accounts found");
    return account;
};
