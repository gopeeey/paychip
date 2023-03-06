import { StandardAccountDto, LoginDto, CreateAccountDto } from "@logic/account";
import { Account } from "@data/account";

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

export const accountSeeder = async () => {
    await Account.create(accountData);
};
