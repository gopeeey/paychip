import { UserProfileRepoInterface } from "../../../contracts/interfaces/db_logic";
import { CreateUserProfileDto, StandardUserProfileDto } from "../../../contracts/dtos";
import { hashString, generateAuthToken } from "../../../utils/functions";
import { LoginDto } from "../../../contracts/dtos";
import { InvalidLoginDetailsError, EmailAlreadyRegisteredError } from "../../errors";
import { UserProfileServiceInterface } from "../../../contracts/interfaces/logic_web";
import bcrypt from "bcrypt";

class UserProfileService implements UserProfileServiceInterface {
    constructor(private readonly _repository: UserProfileRepoInterface) {}

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
