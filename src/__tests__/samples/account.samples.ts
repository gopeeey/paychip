import { StandardAccountDto, LoginDto } from "../../contracts/dtos";
import Account from "../../db/models/account.model";

export const accountData = {
    name: "Sam",
    email: "sammygopeh@gmail.com",
    password: "goldfish",
};

export const account = new Account(accountData);
export const accountJson = account.toJSON();
export const standardAccount = new StandardAccountDto(accountJson);
export const loginDetails = new LoginDto({
    email: accountData.email,
    password: accountData.password,
});
