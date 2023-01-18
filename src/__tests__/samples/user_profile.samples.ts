import { StandardUserProfileDto, LoginDto } from "../../contracts/dtos";
import UserProfile from "../../db/models/user_profile.model";

export const userProfileData = {
    name: "Sam",
    email: "sammygopeh@gmail.com",
    password: "goldfish",
};

export const userProfile = new UserProfile(userProfileData);
export const userProfileJson = userProfile.toJSON();
export const standardUserProfile = new StandardUserProfileDto(userProfileJson);
export const loginDetails = new LoginDto({
    email: userProfileData.email,
    password: userProfileData.password,
});
