import { AccountServiceInterface, AccountNotFoundError } from "@accounts/logic";
import { BusinessServiceInterface, BusinessNotFoundError } from "@business/logic";
import { DependencyContainerInterface } from "src/container";
import { AuthMiddleware } from "@bases/web";
import supertest from "supertest";
import App from "src/app";
import { standardAccount, standardBusiness } from "src/__tests__/helpers/samples";
import * as utilFuncs from "src/utils/functions";

const getAccountByIdMock = jest.fn();
const getBusinessByIdMock = jest.fn();
const verifyJwtMock = jest.spyOn(utilFuncs, "verifyJwt");

const accountService = {
    getById: getAccountByIdMock,
} as unknown as AccountServiceInterface;

const businessService = {
    getById: getBusinessByIdMock,
} as unknown as BusinessServiceInterface;

const authMiddleware = new AuthMiddleware({
    accountService,
    businessService,
});

const appDependencies = {
    authMiddleware,
} as unknown as DependencyContainerInterface;

const app = new App(appDependencies).init();

const testApp = supertest(app);

const testRoutes = async (routes: string[], code: 200 | 401) => {
    const tokens = {
        200: ["Bearer doesn't matter what this is really"],
        401: ["", "doesn't", "Bearer", "Bearer ", "Bearer doesn't"],
    };
    for (const route of routes) {
        for (const token of tokens[code]) {
            const response = await testApp.get(`/empty${route}`).set({
                Authorization: token,
                Accept: "application/json",
            });
            expect(response.statusCode).toBe(code);
        }
    }
};

describe("Testing auth middleware", () => {
    describe("When route requires account auth", () => {
        const routes = ["/account", "/account-and-business", "/account-and-apiKey"];
        describe("Given no or wrong auth token", () => {
            it("should respond with a 401", async () => {
                verifyJwtMock.mockReturnValue({
                    authType: "account",
                    accountId: "two little birds",
                });
                getAccountByIdMock.mockRejectedValue(new AccountNotFoundError());

                await testRoutes(routes, 401);
            });
        });

        describe("Given the right auth token", () => {
            it("should respond with a 200", async () => {
                verifyJwtMock.mockReturnValue({
                    authType: "account",
                    accountId: "two little birds",
                });
                getAccountByIdMock.mockResolvedValue(standardAccount);

                await testRoutes(routes, 200);
            });
        });
    });

    describe("When route requires business auth", () => {
        const routes = ["/business", "/account-and-business", "/business-and-apiKey"];

        describe("Given no or wrong auth token", () => {
            it("should respond with a 401", async () => {
                verifyJwtMock.mockReturnValue({
                    authType: "business",
                    businessId: "two little birds",
                });
                getBusinessByIdMock.mockRejectedValue(new BusinessNotFoundError());

                await testRoutes(routes, 401);
            });
        });

        describe("Given the right auth token", () => {
            it("should respond with a 200", async () => {
                verifyJwtMock.mockReturnValue({
                    authType: "business",
                    businessId: "two little birds",
                });
                getBusinessByIdMock.mockResolvedValue(standardBusiness);

                await testRoutes(routes, 200);
            });
        });
    });
});
