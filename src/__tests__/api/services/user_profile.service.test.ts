import * as userProfileService from "../../../api/services/user_profile.service";
import * as userProfileDal from "../../../db/dal/user_profile.dal";
import { FullUserProfileDto } from "../../../db/dtos/user_profile.dtos";
import * as utilFuncs from "../../../utils/functions";
import {
    userProfile,
    userProfileData,
    userProfileJson,
    userProfilePromise,
    userProfileJsonPromise,
} from "../../samples/user_profile.samples";

const getByEmailMock = jest.spyOn(userProfileDal, "getByEmail");
const dalCreateMock = jest.spyOn(userProfileDal, "create");
const hashStringMock = jest.spyOn(utilFuncs, "hashString");

describe("Testing userProfile service", () => {
    describe("Testing createUserProfile", () => {
        describe("Given a user with the same email already exists", () => {
            it("should throw an error", async () => {
                getByEmailMock.mockReturnValue(userProfileJsonPromise);
                await expect(userProfileService.createUserProfile(userProfileData)).rejects.toThrow(
                    "Email already registered"
                );
                expect(getByEmailMock).toHaveBeenCalledTimes(1);
            });
        });

        describe("Given the email is not already registerd", () => {
            it("should hash the password and return a new user profile object", async () => {
                getByEmailMock.mockResolvedValue(null);
                hashStringMock.mockResolvedValue("password");
                dalCreateMock.mockResolvedValue(userProfileJson);
                const profile = await userProfileService.createUserProfile(userProfileData);
                expect(profile).toEqual(new FullUserProfileDto(userProfileJson));
                expect(hashStringMock).toHaveBeenCalledTimes(1);
                expect(hashStringMock).toHaveBeenCalledWith(userProfileData.password);
                expect(dalCreateMock).toHaveBeenCalledTimes(1);
                expect(dalCreateMock).toHaveBeenCalledWith({
                    ...userProfileData,
                    password: "password",
                });
            });
        });
    });
});
