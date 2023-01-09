import * as userProfileDal from "../../../db/dal/user_profile.dal";
import { CreateUserProfileDto, FullUserProfileDto } from "../../../db/dtos/user_profile.dtos";
import { hashString } from "../../../utils/functions";

export const createUserProfile = async (createUserProfileDto: CreateUserProfileDto) => {
    const { email, password } = createUserProfileDto;
    // check if email is already registered
    const existing = await userProfileDal.getByEmail(email);
    if (existing) throw new Error("Email already registered");
    // hash password
    const passwordHash = await hashString(password);
    const newCreateUserProfileDto = new CreateUserProfileDto({
        ...createUserProfileDto,
        password: passwordHash,
    });

    // persist user
    const profile = await userProfileDal.create(newCreateUserProfileDto);
    return new FullUserProfileDto(profile);
};
