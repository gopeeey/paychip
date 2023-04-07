import { AccountModelInterface, CreateAccountDto } from "@logic/accounts";
import { SQL } from "sql-template-strings";

export const createAccountQuery = (account: AccountModelInterface) => {
    return SQL`
        INSERT INTO accounts ("id", "name", "email", "password") 
        VALUES (${account.id}, ${account.name}, ${account.email}, ${account.password});
    `;
};

export const findByIdQuery = (id: AccountModelInterface["id"]) => {
    return SQL`SELECT * FROM accounts WHERE id = ${id};`;
};

export const findByEmailQuery = (email: AccountModelInterface["email"]) => {
    return SQL`SELECT * FROM accounts WHERE email = ${email}`;
};
