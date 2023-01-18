import { CreateUserProfileDto, LoginDto, StandardUserProfileDto } from "../../../dtos";

export interface UserProfileServiceInterface {
    createUserProfile: (
        createUserProfileDto: CreateUserProfileDto
    ) => Promise<StandardUserProfileDto>;
    signup: (
        createUserProfileDto: CreateUserProfileDto
    ) => Promise<{ userProfile: StandardUserProfileDto; authToken: string }>;
    login: (loginDto: LoginDto) => Promise<{ user: StandardUserProfileDto; authToken: string }>;
}
