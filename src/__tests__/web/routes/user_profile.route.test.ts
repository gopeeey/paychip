import App from "../../../app";
import supertest from "supertest";
import { DependencyContainerInterface } from "../../../d_container";
import { UserProfileServiceInterface } from "../../../contracts/interfaces/logic_web";
import { testRoute } from "./helpers";
import {
    loginDetails,
    standardUserProfile,
    userProfileData,
} from "../../samples/user_profile.samples";
import { ValidationError } from "../../../logic/errors/base_errors";
import { InvalidLoginDetailsError } from "../../../logic/errors";

const signupServiceMock = jest.fn();
const loginMock = jest.fn();

const container = {
    userProfileService: {
        signup: signupServiceMock,
        login: loginMock,
    } as unknown as UserProfileServiceInterface,
} as unknown as DependencyContainerInterface;

const app = new App(container).init();

describe("Testing user profile routes", () => {
    testRoute("/user/signup", (route) => () => {
        // Return a 400 when given invalid data
        describe("Given invalid data", () => {
            it("should return a 400 with error message", async () => {
                const dataSet = [
                    { email: "some@som.com", password: "something is going on" }, // no name
                    { name: "Sam", password: "something is going on" }, // no email
                    { name: "Sam", email: "some@som.com" }, // no password
                    { name: "Sam", email: "somesom.com", password: "myohmyohmy" }, // invalid email
                    { name: "Sam", email: "some@som.com", password: "wrong" }, // invalid password
                ];

                for (const data of dataSet) {
                    const response = await supertest(app).post(route).send(data);
                    expect(response.statusCode).toBe(400);
                    expect(response.body).toHaveProperty("message");
                }
            });
        });
        // Return a 400 when user already exists
        describe("Given the email is already registered", () => {
            it("should return a 400 error with message", async () => {
                signupServiceMock.mockRejectedValue(
                    new ValidationError("Email already registered")
                );
                const response = await supertest(app).post(route).send(userProfileData);
                expect(response.statusCode).toBe(400);
                expect(response.body.message).toBe("Email already registered");
            });
        });

        // Return a 201 when it successfully creates a user profile
        describe("Given the email is not already registered", () => {
            it("should return a 201 with a new user profile", async () => {
                signupServiceMock.mockResolvedValue({
                    userProfile: standardUserProfile,
                    authToken: "token",
                });
                const response = await supertest(app).post(route).send(userProfileData);
                expect(response.statusCode).toBe(201);
                expect(response.body.data).toHaveProperty("userProfile", standardUserProfile);
                expect(response.body.data).toHaveProperty("authToken");
                expect(signupServiceMock).toHaveBeenCalledTimes(1);
                expect(signupServiceMock).toHaveBeenCalledWith(userProfileData);
            });
        });
    });

    testRoute("/user/login", (route) => () => {
        describe("Given invalid data", () => {
            it("should return a 400 with message", async () => {
                const dataSet = [
                    { password: "no email in this request" }, // no email
                    { email: "sam@gmail.com" }, // no password
                    { email: "an invalid email", password: "agoodpassword" }, // invalid email
                ];

                for (const data of dataSet) {
                    const response = await supertest(app).post(route).send(data);
                    expect(response.statusCode).toBe(400);
                    expect(response.body).toHaveProperty("message");
                }
            });
        });

        describe("Given the request doesn't succeed", () => {
            it("should return the appropriate code and error message", async () => {
                loginMock.mockRejectedValue(new InvalidLoginDetailsError());
                const response = await supertest(app).post(route).send(loginDetails);
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty(
                    "message",
                    new InvalidLoginDetailsError().message
                );
            });
        });

        describe("Given the request is successful", () => {
            it("should return data returned from the service login method", async () => {
                const resolvedData =
                    "I can afford to do this here because I'm mocking the login method";
                loginMock.mockResolvedValue(resolvedData);
                const response = await supertest(app).post(route).send(loginDetails);
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty("data", resolvedData);
            });
        });
    });
});
