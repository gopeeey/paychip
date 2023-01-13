import UserProfileRepo from "../../../db/repos/user-profile.repo";
import { CreateUserProfileDto, StandardUserProfileDto } from "../../dtos";
import { hashString, generateJwt, generateAuthToken } from "../../../utils/functions";

class UserProfileService {
    constructor(private readonly _repository: UserProfileRepo) {}

    async createUserProfile(createUserProfileDto: CreateUserProfileDto) {
        const { email, password } = createUserProfileDto;
        // check if email is already registered
        const existing = await this._repository.findByEmail(email);
        if (existing) throw new Error("Email already registered");

        // hash password
        const passwordHash = await hashString(password);
        const newCreateUserProfileDto = new CreateUserProfileDto({
            ...createUserProfileDto,
            password: passwordHash,
        });

        // persist user
        const profile = await this._repository.create(newCreateUserProfileDto);
        return new StandardUserProfileDto(profile);
    }

    async signup(createUserProfileDto: CreateUserProfileDto) {
        // const {email, password, name} = createUserProfileDto;
        const userProfile = await this.createUserProfile(createUserProfileDto);
        const authToken = generateAuthToken("user", { userId: userProfile.id });
        return { userProfile, authToken };
    }
}

export default UserProfileService;
