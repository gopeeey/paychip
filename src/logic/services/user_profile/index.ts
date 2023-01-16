import UserProfileRepo from "../../../db/repos/user-profile.repo";
import { CreateUserProfileDto, StandardUserProfileDto } from "../../dtos";
import { hashString, generateJwt, generateAuthToken } from "../../../utils/functions";
import { EmailAlreadyRegisteredError } from "../../errors/user_profile_errors/email_already_registered_error";
import { LoginDto } from "../../dtos";
import { InvalidLoginDetailsError, UserNotFoundError } from "../../errors";
import bcrypt from "bcrypt";
import * as utilFuncs from "../../../utils/functions";

class UserProfileService {
    constructor(private readonly _repository: UserProfileRepo) {}

    async createUserProfile(createUserProfileDto: CreateUserProfileDto) {
        const { email, password } = createUserProfileDto;
        // check if email is already registered
        const existing = await this._repository.findByEmail(email);
        if (existing) throw new EmailAlreadyRegisteredError();

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

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const userProfile = await this._repository.findByEmail(email);
        if (!userProfile) throw new InvalidLoginDetailsError();
        const passMatch = await bcrypt.compare(password, userProfile.password);
        if (!passMatch) throw new InvalidLoginDetailsError();
        const authToken = generateAuthToken("user", { userId: userProfile.id });

        return { user: new StandardUserProfileDto(userProfile), authToken };
    }
}

export default UserProfileService;
