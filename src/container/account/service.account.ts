import { AccountService } from "../../logic/services";
import { accountRepo } from "./repo.account";

export const accountService = new AccountService({
    repo: accountRepo,
});

export const getAccountById = accountService.getById;
