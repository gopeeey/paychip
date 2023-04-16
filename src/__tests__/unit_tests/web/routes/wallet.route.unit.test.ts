import App from "src/app";
import supertest from "supertest";
import { DependencyContainerInterface } from "src/container";
import { getMiddlewareMocks, testRoute } from "./helpers";
import { businessLevelToken, standardWallet, walletJson, walletData } from "src/__tests__/samples";
import { createClassSpies } from "src/__tests__/mocks";
import { CreateWalletDto, WalletService, WalletServiceDependencies } from "@logic/wallet";

const walletService = createClassSpies(
    new WalletService({} as unknown as WalletServiceDependencies),
    ["createWallet"]
);

const mm = getMiddlewareMocks();

const container = {
    authMiddleware: mm.authMiddleware,
    walletService,
} as unknown as DependencyContainerInterface;

const middlewareDeps = { business: mm.businessService, account: mm.accountService };

const app = new App(container).init();

const testApp = supertest(app);

describe("TESTING WALLET ROUTES", () => {
    testRoute(
        "/wallet",
        (route, mockMiddleware) => () => {
            // Return 400 when given invalid data
            describe("Given invalid data", () => {
                it("should return status code 400", async () => {
                    // this is so the auth middleware can attach the account object to the request
                    if (mockMiddleware) mockMiddleware();

                    const rootData = {
                        currency: "NGN",
                        email: "sammygopeh@gmail.com",
                        waiveFundingCharges: false,
                        waiveWithdrawalCharges: false,
                        waiveWalletInCharges: false,
                        waiveWalletOutCharges: false,
                    };

                    const { email, ...noEmail } = rootData;
                    const { currency, ...noCurrency } = rootData;

                    const dataSet = [noEmail, noCurrency];

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
                    walletService.createWallet.mockResolvedValue(walletJson);
                    const { businessId, businessWalletId, ...form } = walletData;
                    const { statusCode, body } = await testApp
                        .post(route)
                        .send(form)
                        .set({ Authorization: businessLevelToken });

                    console.log("\n\n\nBODY:", body);
                    expect(statusCode).toBe(201);
                    expect(body).toHaveProperty("message");
                    expect(body).toHaveProperty("data.wallet", standardWallet);
                    expect(walletService.createWallet).toHaveBeenCalledTimes(1);
                });
            });

            // Return 400 when the country is not supported
        },
        { middlewareDeps }
    );
});
