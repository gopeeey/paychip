import UserProfile from "./db/models/user_profile.model";
import UserProfileRepo from "./db/repos/user-profile.repo";
import UserProfileService from "./logic/services/user_profile";

export interface DependencyContainerInterface {
    userProfileService: UserProfileService;
}
const userProfileService = new UserProfileService(new UserProfileRepo(UserProfile));

const container: DependencyContainerInterface = {
    userProfileService,
};

export default container;
