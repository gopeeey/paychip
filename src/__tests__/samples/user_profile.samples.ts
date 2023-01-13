import { StandardUserProfileDto } from "../../logic/dtos";
import UserProfile from "../../db/models/user_profile.model";
import * as utilFuncs from "../../utils/functions";

export const userProfileData = {
    name: "Sam",
    email: "sammygopeh@gmail.com",
    password: "goldfish",
};

export const userProfile = new UserProfile(userProfileData);
export const userProfileJson = userProfile.toJSON();
export const standardUserProfile = new StandardUserProfileDto(userProfileJson);
