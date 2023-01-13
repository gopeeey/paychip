import UserProfile, { UserProfileCreationAttributes } from "../models/user_profile.model";
import { CreateUserProfileDto } from "../../logic/dtos/user_profile.dtos";

export const create = async (createUserProfileDto: CreateUserProfileDto) => {
    const { name, email, password } = createUserProfileDto;
    const profile = await UserProfile.create({ name, email, password });
    return profile.toJSON();
};

export const getByEmail = async (email: string) => {
    const profile = await UserProfile.findOne({ where: { email } });
    return profile ? profile.toJSON() : null;
};
