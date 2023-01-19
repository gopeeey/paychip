import { Account } from "./db/models";
import { AccountRepo } from "./db/repos";
import { AccountService } from "./logic/services";

export interface DependencyContainerInterface {
    accountService: AccountService;
}
const accountService = new AccountService(new AccountRepo(Account));

const container: DependencyContainerInterface = {
    accountService,
};

export default container;
