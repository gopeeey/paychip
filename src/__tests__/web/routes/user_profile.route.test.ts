import App from "../../../app";
import supertest from "supertest";
import { DependencyContainerInterface } from "../../../d_container";
import UserProfileService from "../../../logic/services/user_profile";
import { testRoute } from "./helpers";

const signupServiceMock = jest.fn();

const container = {
    userProfileService: {
        signup: signupServiceMock,
    } as unknown as UserProfileService,
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
        // Return a 201 when it successfully creates a user profile
    });
});
