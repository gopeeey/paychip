import App from "src/app";
import supertest from "supertest";
import { AuthMiddlewareDependencies, AuthMiddleware } from "@web/middleware";
import { DependencyContainerInterface } from "src/container";
import { testRoute } from "./helpers";
import {
    businessJson,
    businessLevelToken,
    standardAccount,
    standardWallet,
    walletJsons,
    walletSampleData,
} from "../../samples";

const businessService = {
    getById: jest.fn(),
};

const accountService = { getById: jest.fn() };

const walletService = {
    createBusinessWallet: jest.fn(),
};

const authMiddleware = new AuthMiddleware({
    businessService,
    accountService,
} as unknown as AuthMiddlewareDependencies);

const container = {
    businessService,
    authMiddleware,
    walletService,
} as unknown as DependencyContainerInterface;

const app = new App(container).init();

const testApp = supertest(app);

describe("TESTING WALLET ROUTES", () => {
    testRoute("/wallet/create", (route) => () => {
        // Return 400 when given invalid data
        describe("Given invalid data", () => {
            it("should return status code 400", async () => {
                // this is so the auth middleware can attach the account object to the request
                accountService.getById.mockResolvedValue(standardAccount);
                businessService.getById.mockResolvedValue(businessJson);

                const rootData = {
                    chargeSchemeId: null,
                    currency: "NGN",
                    email: "sammygopeh@gmail.com",
                    waiveFundingCharges: false,
                    waiveWithdrawalCharges: false,
                    walletType: "commercial",
                };

                const { email, ...noEmail } = rootData;
                const { currency, ...noCurrency } = rootData;
                const { walletType, ...noWalletType } = rootData;

                const dataSet = [noEmail, noCurrency, noWalletType];

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
            it("should return a standard wallet dto", async () => {
                walletService.createBusinessWallet.mockResolvedValue(walletJsons.withParent);
                const { businessId, parentWalletId, chargeSchemeId, ...form } =
                    walletSampleData.noParent;
                const { statusCode, body } = await testApp
                    .post(route)
                    .send(form)
                    .set({ Authorization: businessLevelToken });
                expect(statusCode).toBe(201);
                expect(body).toHaveProperty("message");
                expect(body).toHaveProperty("data.wallet", standardWallet.withParent);
                expect(walletService.createBusinessWallet).toHaveBeenCalledTimes(1);
            });
        });

        // Return 400 when the country is not supported
    });
});
