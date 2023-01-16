import UserProfileRepo from "../../../db/repos/user-profile.repo";
import UserProfile from "../../../db/models/user_profile.model";
import { userProfile, userProfileData, userProfileJson } from "../../samples/user_profile.samples";

const createMock = jest.fn();
const findOneMock = jest.fn();
const modelContext = {
    create: createMock,
    findOne: findOneMock,
} as unknown as typeof UserProfile;
const userProfileRepo = new UserProfileRepo(modelContext);

describe("Testing UserProfileRepo", () => {
    describe("Testing create method", () => {
        it("should return a new user UserProfile instance", async () => {
            createMock.mockResolvedValue(userProfile);
            const newUserProfile = await userProfileRepo.create(userProfileData);
            expect(newUserProfile).toEqual(userProfileJson);
            expect(createMock).toHaveBeenCalledTimes(1);
            expect(createMock).toHaveBeenCalledWith(userProfileData);
        });
    });

    describe("Testing findByEmail method", () => {
        describe("Given the user profile exists", () => {
            it("should return a user profile object", async () => {
                findOneMock.mockResolvedValue(userProfile);
                const response = await userProfileRepo.findByEmail(userProfileData.email);
                expect(response).toEqual(userProfileJson);
                expect(findOneMock).toHaveBeenCalledTimes(1);
            });
        });

        describe("Given the user profile does not exist", () => {
            it("should return null", async () => {
                findOneMock.mockResolvedValue(null);
                const profile = await userProfileRepo.findByEmail("somerandomstring");
                expect(findOneMock).toHaveBeenCalledTimes(1);
                expect(profile).toBe(null);
            });
        });
    });
});
