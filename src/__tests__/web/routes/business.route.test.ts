import App from "../../../app";
import supertest from "supertest";
import {
    DependencyContainerInterface,
    AuthMiddlewareDependencies,
} from "../../../contracts/interfaces";
import { testRoute } from "./helpers";
import {
    accountLevelToken,
    businessData,
    standardAccount,
    standardBusinessArr,
} from "../../samples";
import { InvalidLoginDetailsError, ValidationError } from "../../../logic/errors";
import { AuthMiddleware } from "../../../web/middleware";

const businessService = {
    createBusiness: jest.fn(),
    getById: jest.fn(),
    getOwnerBusinesses: jest.fn(),
};

const accountService = { getById: jest.fn() };

const authMiddleware = new AuthMiddleware({
    businessService,
    accountService,
} as unknown as AuthMiddlewareDependencies);

const container = {
    businessService,
    authMiddleware,
} as unknown as DependencyContainerInterface;

const app = new App(container).init();

const testApp = supertest(app);

describe("Testing business routes", () => {
    testRoute("/business/create", (route) => () => {
        // Return 400 when given invalid data
        describe("Given invalid data", () => {
            it("should return status code 400", async () => {
                // this is so the auth middleware can attach the account object to the request
                accountService.getById.mockResolvedValue(standardAccount);

                const dataSet = [
                    { name: "", countryCode: "NG" },
                    { name: 123, countryCode: "" },
                    { name: "Sam", countryCode: "" },
                    { name: "Sam", countryCode: 123 },
                ];

                for (const data of dataSet) {
                    const { statusCode, body } = await testApp
                        .post(route)
                        .send(data)
                        .set({ Authorization: accountLevelToken });
                    expect(statusCode).toBe(400);
                    expect(body).toHaveProperty("message");
                }
            });
        });

        // Return 400 when the country is not supported
    });

    testRoute("/business/owner", (route) => () => {
        describe("Given owner has businesses", () => {
            it("should respond with a 200 and businesses array", async () => {
                businessService.getOwnerBusinesses.mockResolvedValue(standardBusinessArr);
                const { statusCode, body } = await testApp
                    .get(route)
                    .set({ Authorization: accountLevelToken });
                expect(statusCode).toBe(200);
                expect(body).toHaveProperty("data.businesses", standardBusinessArr);
            });
        });

        describe("Given owner has no businesses", () => {
            it("should respond with a 200 and an empty businesses array", async () => {
                businessService.getOwnerBusinesses.mockResolvedValue([]);
                const { statusCode, body } = await testApp
                    .get(route)
                    .set({ Authorization: accountLevelToken });
                expect(statusCode).toBe(200);
                expect(body).toHaveProperty("data.businesses", []);
            });
        });
    });
});
