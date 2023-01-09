import UserProfile from "../../../db/models/user_profile.model";
import * as userProfileDal from "../../../db/dal/user_profile.dal";
import * as utilFuncs from "../../../utils/functions";
import {
    userProfile,
    userProfileData,
    userProfileJson,
    userProfilePromise,
} from "../../samples/user_profile.samples";

const createMock = jest.spyOn(UserProfile, "create");
const findOneMock = jest.spyOn(UserProfile, "findOne");

describe("Testing UserProfile DAL", () => {
    describe("Testing create fn", () => {
        it("should return a new user UserProfile instance", async () => {
            createMock.mockReturnValue(userProfilePromise);
            const newUserProfile = await userProfileDal.create(userProfileData);
            expect(newUserProfile).toEqual(userProfileJson);
            expect(createMock).toHaveBeenCalledTimes(1);
            expect(createMock).toHaveBeenCalledWith(userProfileData);
        });
    });

    describe("Testing getByEmail fn", () => {
        describe("Given the user profile exists", () => {
            it("should return a user profile object", async () => {
                findOneMock.mockReturnValue(userProfilePromise);
                const response = await userProfileDal.getByEmail(userProfileData.email);
                expect(response).toEqual(userProfileJson);
                expect(findOneMock).toHaveBeenCalledTimes(1);
            });
        });

        describe("Given the user profile does not exist", () => {
            it("should return null", async () => {
                findOneMock.mockReturnValue(utilFuncs.promisifyValue(null));
                const profile = await userProfileDal.getByEmail("somerandomstring");
                expect(findOneMock).toHaveBeenCalledTimes(1);
                expect(profile).toBe(null);
            });
        });
    });
});
