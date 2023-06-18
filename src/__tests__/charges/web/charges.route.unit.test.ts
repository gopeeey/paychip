import App from "src/app";
import supertest from "supertest";
import { DependencyContainerInterface } from "src/container";
import {
    testRoute,
    getMiddlewareMocks,
} from "src/__tests__/helpers/test_utils/route_testing_helpers";
import {
    businessJson,
    businessLevelToken,
    chargeStackData,
    chargeStackJson,
    standardChargeStack,
    walletJson,
} from "src/__tests__/helpers/samples";
import { AddChargeStackToWalletDto } from "@charges/logic";
import { validateBusinessObjectIdMock } from "src/__tests__/helpers/mocks";

const chargesService = {
    createStack: jest.fn(),
    createCharge: jest.fn(),
    addChargesToStack: jest.fn(),
    addStackToWallet: jest.fn(),
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

                    const { name, ...noName } = chargeStackData.wallet;
                    const { paidBy, ...noPaidBy } = chargeStackData.wallet;
                    const wrongPaidBy = { ...chargeStackData.wallet, paidBy: "me" };

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
                    chargesService.createStack.mockResolvedValue(chargeStackJson.wallet);

                    const { businessId, ...data } = chargeStackData.wallet;
                    const { statusCode, body } = await testApp
                        .post(route)
                        .send(data)
                        .set({ Authorization: businessLevelToken });

                    expect(statusCode).toBe(201);
                    expect(body).toHaveProperty("data.chargeStack", standardChargeStack.wallet);
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
        "/charges/stacks/add-to-wallet",
        (route, mockMiddleware) => () => {
            describe("Given invalid data", () => {
                it("should respond with a 400", async () => {
                    if (mockMiddleware) mockMiddleware();

                    const dto = new AddChargeStackToWalletDto({
                        walletId: walletJson.id,
                        chargeStackId: chargeStackJson.wallet.id,
                        chargeType: "funding",
                    });

                    const { walletId, ...noWalletId } = dto;
                    const { chargeStackId, ...noChargeStackId } = dto;
                    const { chargeType, ...noChargeType } = dto;

                    const invalidData = [noWalletId, noChargeStackId, noChargeType];

                    for (const data of invalidData) {
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
                it("should respond with a 200", async () => {
                    if (mockMiddleware) mockMiddleware();

                    validateBusinessObjectIdMock.mockImplementation(() => {});
                    chargesService.addStackToWallet.mockResolvedValue(undefined);

                    const dto = new AddChargeStackToWalletDto({
                        walletId: walletJson.id,
                        chargeStackId: chargeStackJson.wallet.id,
                        chargeType: "funding",
                    });

                    const { statusCode } = await testApp
                        .post(route)
                        .send(dto)
                        .set({ Authorization: businessLevelToken });

                    expect(statusCode).toBe(200);
                    expect(validateBusinessObjectIdMock).toHaveBeenCalledTimes(1);
                    expect(validateBusinessObjectIdMock).toHaveBeenCalledWith(
                        [dto.walletId, dto.chargeStackId],
                        businessJson.id
                    );
                });
            });
        },
        { middlewareDeps }
    );
});
