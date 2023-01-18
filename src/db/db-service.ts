import Account from "./models/account.model";

class DBService {
    get account() {
        return Account;
    }
}

export default DBService;
