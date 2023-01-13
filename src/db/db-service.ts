import UserProfile from "./models/user_profile.model";

class DBService {
    get user_profile() {
        return UserProfile;
    }
}

export default DBService;
