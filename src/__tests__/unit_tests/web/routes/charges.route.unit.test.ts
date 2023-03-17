import App from "src/app";
import supertest from "supertest";
import { AuthMiddlewareDependencies, AuthMiddleware } from "@web/middleware";
import { DependencyContainerInterface } from "src/container";
import { testRoute } from "./helpers";
import {
    accountJson,
    businessJson,
    businessLevelToken,
    chargeStackData,
    chargeStackJson,
    standardChargeStack,
} from "src/__tests__/samples";

const businessService = {
    getById: jest.fn(),
};

const accountService = { getById: jest.fn() };

const chargesService = {
    createStack: jest.fn(),
};

const authMiddleware = new AuthMiddleware({
    businessService,
    accountService,
} as unknown as AuthMiddlewareDependencies);

const container = {
    businessService,
    authMiddleware,
    chargesService,
} as unknown as DependencyContainerInterface;

const app = new App(container).init();

const testApp = supertest(app);

describe("TESTING CHARGE SCHEME ROUTES", () => {
    testRoute("/charges/stacks", (route) => () => {
        describe("Given invalid data", () => {
            it("should respond with a 400", async () => {
                // this is so the auth middleware can attach the account object to the request
                accountService.getById.mockResolvedValue(accountJson);
                businessService.getById.mockResolvedValue(businessJson);

                const { name, ...noName } = chargeStackData.sender;
                const { paidBy, ...noPaidBy } = chargeStackData.sender;
                const wrongPaidBy = { ...chargeStackData.sender, paidBy: "me" };

                const dataSet = [noName, noPaidBy, wrongPaidBy];

                for (const data of dataSet) {
                    const { statusCode, body } = await testApp
                        .post(route)
                        .send(data)
                        .set({ Authorization: businessLevelToken });
                    expect(statusCode).toBe(400);
                    expect(body).toHaveProperty("message");
                }
            });
        });

        describe("Given valid data", () => {
            it("should respond with a 201 and a standard charge stack object", async () => {
                chargesService.createStack.mockResolvedValue(chargeStackJson.sender);

                const { businessId, ...data } = chargeStackData.sender;
                const { statusCode, body } = await testApp
                    .post(route)
                    .send(data)
                    .set({ Authorization: businessLevelToken });
                expect(statusCode).toBe(201);
                expect(body).toHaveProperty("data.chargeStack", standardChargeStack.sender);
                expect(chargesService.createStack).toHaveBeenCalledTimes(1);
                expect(chargesService.createStack).toHaveBeenCalledWith({
                    ...data,
                    businessId: businessJson.id,
                });
            });
        });
    });

    testRoute("/charges", (route) => () => {
        describe("Given invalid data", () => {
            it("should respond with a 400", async () => {});
        });
    });
});
