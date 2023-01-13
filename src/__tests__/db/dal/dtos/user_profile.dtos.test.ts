import {
    CreateUserProfileDto,
    StandardUserProfile,
} from "../../../../logic/dtos/user_profile.dtos";

describe("Testing UserProfile DTOs", () => {
    describe("Testing CreateUserProfileDto", () => {
        it("should create a dto containing name, email and password", () => {
            const data = { name: "Sam", email: "sam", password: "1111" };
            const dto = new CreateUserProfileDto(data);
            expect(dto.email).toBe(data.email);
            expect(dto.name).toBe(data.name);
            expect(dto.password).toBe(data.password);
        });
    });

    describe("Testing StandardUserProfile", () => {
        it("should create a dto that contains all user fields except password", () => {
            const data = { name: "Sam", email: "sam", password: "1111" };
            const dto = new StandardUserProfile(data);
            expect(dto.email).toBe(data.email);
            expect(dto.name).toBe(data.name);
        });
    });
});
