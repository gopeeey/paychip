import App from "src/app";
import supertest from "supertest";
import { DependencyContainerInterface } from "src/container";
import { testRoute, getMiddlewareMocks } from "./helpers";
import {
    businessJson,
    businessLevelToken,
    chargeStackData,
    chargeStackJson,
    standardChargeStack,
    chargeData,
    chargeJson,
    standardCharge,
} from "src/__tests__/samples";
import { CreateChargeDto } from "@logic/charges";

const chargesService = {
    createStack: jest.fn(),
    createCharge: jest.fn(),
};

const mm = getMiddlewareMocks();

const container = {
    authMiddleware: mm.authMiddleware,
    chargesService,
} as unknown as DependencyContainerInterface;

const app = new App(container).init();

const testApp = supertest(app);

const middlewareDeps = { business: mm.businessService, account: mm.accountService };

describe("TESTING CHARGE SCHEME ROUTES", () => {
    testRoute(
        "/charges/stacks",
        (route, mockMiddleware) => () => {
            describe("Given invalid data", () => {
                it("should respond with a 400", async () => {
                    // this is so the auth middleware can attach the account object to the request
                    if (mockMiddleware) mockMiddleware();

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
        },
        { middlewareDeps }
    );

    testRoute(
        "/charges",
        (route, mockMiddleware) => () => {
            describe("Given invalid data", () => {
                it("should respond with a 400", async () => {
                    if (mockMiddleware) mockMiddleware();

                    const { name, businessId, ...noName } = chargeData;

                    const { statusCode, body } = await testApp
                        .post(route)
                        .send(noName)
                        .set({ Authorization: businessLevelToken });

                    expect(statusCode).toBe(400);
                    expect(body).toHaveProperty("message");
                });
            });

            describe("Given valid data", () => {
                it.only("should create and respond with a new standard charge object", async () => {
                    if (mockMiddleware) mockMiddleware();

                    const { businessId, ...data } = new CreateChargeDto({
                        ...chargeData,
                        businessId: businessJson.id,
                    });
                    chargesService.createCharge.mockResolvedValue(chargeJson);
                    const { statusCode, body } = await testApp
                        .post(route)
                        .send(data)
                        .set({ Authorization: businessLevelToken });

                    expect(statusCode).toBe(201);
                    expect(body).toHaveProperty("data.charge", standardCharge);
                    expect(chargesService.createCharge).toHaveBeenCalledTimes(1);
                    expect(chargesService.createCharge).toHaveBeenCalledWith({
                        ...data,
                        businessId: businessJson.id,
                    });
                });
            });
        },
        { middlewareDeps }
    );
});
