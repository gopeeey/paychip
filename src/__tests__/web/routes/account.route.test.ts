import App from "../../../app";
import supertest from "supertest";
import {
    AccountServiceInterface,
    DependencyContainerInterface,
} from "../../../contracts/interfaces";
import { testRoute } from "./helpers";
import { loginDetails, standardAccount, accountData } from "../../samples/account.samples";
import { InvalidLoginDetailsError, ValidationError } from "../../../logic/errors";

const signupServiceMock = jest.fn();
const loginMock = jest.fn();

const container = {
    accountService: {
        signup: signupServiceMock,
        login: loginMock,
    } as unknown as AccountServiceInterface,
} as unknown as DependencyContainerInterface;

const app = new App(container).init();

describe("Testing account routes", () => {
    testRoute("/account/signup", (route) => () => {
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
        // Return a 400 when account already exists
        describe("Given the email is already registered", () => {
            it("should return a 400 error with message", async () => {
                signupServiceMock.mockRejectedValue(
                    new ValidationError("Email already registered")
                );
                const response = await supertest(app).post(route).send(accountData);
                expect(response.statusCode).toBe(400);
                expect(response.body.message).toBe("Email already registered");
            });
        });

        // Return a 201 when it successfully creates a account
        describe("Given the email is not already registered", () => {
            it("should return a 201 with a new account", async () => {
                signupServiceMock.mockResolvedValue({
                    account: standardAccount,
                    authToken: "token",
                });
                const response = await supertest(app).post(route).send(accountData);
                expect(response.statusCode).toBe(201);
                expect(response.body.data).toHaveProperty("account", standardAccount);
                expect(response.body.data).toHaveProperty("authToken");
                expect(signupServiceMock).toHaveBeenCalledTimes(1);
                expect(signupServiceMock).toHaveBeenCalledWith(accountData);
            });
        });
    });

    testRoute("/account/login", (route) => () => {
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
