import { StandardAccountDto, LoginDto, CreateAccountDto } from "@logic/accounts";
import { Account } from "@data/accounts";
import { generateId } from "src/utils";
import { createAccountQuery } from "@data/accounts/queries";
import { runQuery } from "@data/db";
import { Pool } from "pg";

export const accountData: CreateAccountDto = {
    name: "Sam",
    email: "sammygopeh@gmail.com",
    password: "goldfish",
};

export const account = new Account({ ...accountData, id: "accountId" });

export const accountJson = account.toJSON();
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
