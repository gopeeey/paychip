import App from "src/app";
import supertest from "supertest";
import { AuthMiddlewareDependencies, AuthMiddleware } from "@web/middleware";
import { DependencyContainerInterface } from "src/container";
import { testRoute } from "./helpers";
import { loginDetails, standardAccount, accountData, accountJson } from "src/__tests__/samples";
import { ValidationError } from "@logic/base_errors";
import { InvalidLoginDetailsError } from "@logic/accounts";

const accountService = {
    signup: jest.fn(),
    login: jest.fn(),
    getById: jest.fn(),
};

const businessService = {
    getById: jest.fn(),
};

const authMiddleware = new AuthMiddleware({
    accountService,
    businessService,
} as unknown as AuthMiddlewareDependencies);

const container = {
    accountService,
    businessService,
    authMiddleware,
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
                accountService.signup.mockRejectedValue(
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
                accountService.signup.mockResolvedValue({
                    account: accountJson,
                    authToken: "token",
                });
                const response = await supertest(app).post(route).send(accountData);
                expect(response.statusCode).toBe(201);
                expect(response.body.data).toHaveProperty("account", standardAccount);
                expect(response.body.data).toHaveProperty("authToken");
                expect(accountService.signup).toHaveBeenCalledTimes(1);
                expect(accountService.signup).toHaveBeenCalledWith(accountData);
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
                accountService.login.mockRejectedValue(new InvalidLoginDetailsError());
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
                const resolvedData = {
                    account: accountJson,
                    authToken: "token",
                };
                accountService.login.mockResolvedValue(resolvedData);
                const response = await supertest(app).post(route).send(loginDetails);
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty("data", {
                    account: standardAccount,
                    authToken: "token",
                });
            });
        });
    });
});
