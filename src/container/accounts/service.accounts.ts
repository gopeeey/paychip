import { AccountService } from "@logic/accounts";
import { accountRepo } from "./repo.accounts";

export const accountService = new AccountService({
    repo: accountRepo,
});

export const getAccountById = accountService.getById;
