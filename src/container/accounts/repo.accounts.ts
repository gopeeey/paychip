import { Account, AccountRepo } from "@data/accounts";
import { pool } from "../db";

export const accountRepo = new AccountRepo(pool);
