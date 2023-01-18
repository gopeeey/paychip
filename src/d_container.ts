import Account from "./db/models/account.model";
import AccountRepo from "./db/repos/account.repo";
import AccountService from "./logic/services/account";

export interface DependencyContainerInterface {
    accountService: AccountService;
}
const accountService = new AccountService(new AccountRepo(Account));

const container: DependencyContainerInterface = {
    accountService,
};

export default container;
