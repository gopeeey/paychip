import UserProfileRepo from "../../../../db/repos/user-profile.repo";
import UserProfileService from "../../../../logic/services/user_profile";
import {
    userProfileJson,
    userProfileData,
    standardUserProfile,
} from "../../../samples/user_profile.samples";
import * as utilFuncs from "../../../../utils/functions";

const createMock = jest.fn();
const findByEmailMock = jest.fn();

const repo = {
    create: createMock,
    findByEmail: findByEmailMock,
} as unknown as UserProfileRepo;

const userProfileService = new UserProfileService(repo);

const createUserProfileMock = jest.spyOn(userProfileService, "createUserProfile");
const hashStringMock = jest.spyOn(utilFuncs, "hashString");
const generateJwtMock = jest.spyOn(utilFuncs, "generateJwt");

describe("Testing userProfile service", () => {
    describe("Testing createUserProfile", () => {
        describe("Given a user with the same email already exists", () => {
            it("should throw an error", async () => {
                findByEmailMock.mockResolvedValue(userProfileJson);
                await expect(userProfileService.createUserProfile(userProfileData)).rejects.toThrow(
                    "Email already registered"
                );
                expect(findByEmailMock).toHaveBeenCalledTimes(1);
            });
        });

        describe("Given the email is not already registerd", () => {
            it("should hash the password", async () => {
                findByEmailMock.mockResolvedValue(null);
                hashStringMock.mockResolvedValue("password");
                createMock.mockResolvedValue(userProfileJson);
                await userProfileService.createUserProfile(userProfileData);
                expect(hashStringMock).toHaveBeenCalledTimes(1);
                expect(hashStringMock).toHaveBeenCalledWith(userProfileData.password);
            });

            it("should return a new user profile object", async () => {
                const profile = await userProfileService.createUserProfile(userProfileData);
                expect(profile).toEqual(standardUserProfile);
                expect(createMock).toHaveBeenCalledTimes(1);
                expect(createMock).toHaveBeenCalledWith({
                    ...userProfileData,
                    password: "password",
                });
            });
        });
    });

    describe("Testing signup", () => {
        // Creates a business for the user
        it("should create a user profile", async () => {
            await userProfileService.signup(userProfileData);
            createUserProfileMock.mockResolvedValue(standardUserProfile);
            expect(createUserProfileMock).toHaveBeenCalledTimes(1);
            expect(createUserProfileMock).toHaveBeenCalledWith(userProfileData);
        });
        // Generates an auth token for the user
        it("should generate a user auth token", async () => {
            generateJwtMock.mockReturnValue("authtoken");
            const response = await userProfileService.signup(userProfileData);
            expect(response).toHaveProperty("userProfile");
            expect(response).toHaveProperty("authToken");
            expect(generateJwtMock).toHaveBeenCalledTimes(1);
            expect(generateJwtMock).toHaveBeenCalledWith({
                authType: "user",
                data: { userId: response.userProfile.id },
            });
        });
    });
});
