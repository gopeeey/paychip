import { Account } from "../../db/models";
import { AccountRepo } from "../../db/repos";

export const accountRepo = new AccountRepo(Account);
