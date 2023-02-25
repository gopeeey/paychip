import { AccountService } from "@logic/account";
import { accountRepo } from "./repo.account";

export const accountService = new AccountService({
    repo: accountRepo,
});

export const getAccountById = accountService.getById;
