import { PaystackRepo } from "@third_party/payment_providers/data";
import {
    GeneratePaymentLinkDto,
    GeneratePaymentLinkError,
    VerifyTransactionResponseDto,
} from "@third_party/payment_providers/logic";
import { HttpClientInstanceMock, logErrorMock } from "src/__tests__/helpers/mocks";
import { HttpError, PostRequestArgsInterface } from "src/utils";
import config from "src/config";

jest.mock("../../../../../utils/http_client/client", () => ({
    HttpClient: jest.fn(() => HttpClientInstanceMock),
}));

const paystackRepo = new PaystackRepo();

const paymentData = new GeneratePaymentLinkDto({
    allowedChannels: ["card"],
    amount: 4000,
    currency: "NGN",
    transactionId: "sdlkfjs",
    walletId: "sldkjfsldk",
});

const sampleTrxRes = {
    status: true,
    message: "Transaction retrieved",
    data: {
        id: 292584114,
        domain: "test",
        status: "success",
        reference: "203520101",
        amount: 10000,
        message: null,
        gateway_response: "Successful",
        paid_at: "2019-10-09T13:03:28.000Z",
        created_at: "2019-10-09T13:00:16.000Z",
        channel: "card",
        currency: "NGN",
        ip_address: "197.211.43.98",
        metadata: {
            custom_fields: [
                {
                    display_name: "Mobile Number",
                    variable_name: "mobile_number",
                    value: "+2348012345678",
                },
            ],
            referrer: "http://localhost:3001/integration/microphone.html?",
        },
        log: {
            start_time: 1570626018,
            time_spent: 192,
            attempts: 1,
            errors: 0,
            success: true,
            mobile: false,
            input: [],
            history: [
                {
                    type: "action",
                    message: "Attempted to pay with card",
                    time: 191,
                },
                {
                    type: "success",
                    message: "Successfully paid with card",
                    time: 192,
                },
            ],
        },
        fees: 150,
        fees_split: null,
        authorization: {
            authorization_code: "AUTH_2e4k18sj52",
            bin: "408408",
            last4: "4081",
            exp_month: "12",
            exp_year: "2020",
            channel: "card",
            card_type: "visa DEBIT",
            bank: "Test Bank",
            country_code: "NG",
            brand: "visa",
            reusable: true,
            signature: "SIG_JrPFkMYhcu8AD75eQWKl",
            account_name: "BoJack Horseman",
        },
        customer: {
            id: 1809887,
            first_name: null,
            last_name: null,
            email: "customer@email.com",
            customer_code: "CUS_0c35ys9w8ma5tbr",
            phone: null,
            metadata: null,
            risk_action: "deny",
        },
        plan: {},
        subaccount: {},
        order_id: null,
        paidAt: "2019-10-09T13:03:28.000Z",
        createdAt: "2019-10-09T13:00:16.000Z",
        requested_amount: 1500000,
    },
};

describe("Testing PaystackRepo", () => {
    describe(">>> generatePaymentLink", () => {
        describe("given the request to the provider succeeds", () => {
            it("should return a string gotten from a request to the provider", async () => {
                const expectedUrl = "https://go.com";
                HttpClientInstanceMock.post.mockResolvedValue({
                    status: true,
                    data: { authorization_url: expectedUrl },
                });

                const link = await paystackRepo.generatePaymentLink(paymentData);

                const postRequestData: PostRequestArgsInterface = {
                    url: "/transaction/initialize",
                    body: {
                        amount: paymentData.amount,
                        email: paymentData.walletId + config.misc.emailSuffix,
                        currency: paymentData.currency,
                        reference: paymentData.transactionId,
                        channels: ["card"],
                    },
                };
                expect(link).toBe(expectedUrl);
                expect(HttpClientInstanceMock.post).toHaveBeenCalledTimes(1);
                expect(HttpClientInstanceMock.post).toHaveBeenCalledWith(postRequestData);
            });
        });

        describe("given the request to the provider fails", () => {
            it("should throw a GeneratePaymentLinkError", async () => {
                const err = new HttpError({ message: "work" });
                HttpClientInstanceMock.post.mockRejectedValue(err);
                try {
                    await paystackRepo.generatePaymentLink(paymentData);
                    throw new Error("Did not throw error");
                } catch (err) {
                    expect(err).toBeInstanceOf(GeneratePaymentLinkError);
                    if (err instanceof GeneratePaymentLinkError) {
                        expect(err.message).toBe(config.payment.providerErrorMessage);
                    } else {
                        throw new Error("Not throwing the right error");
                    }
                }
            });
        });
    });

    describe(">>> verifyTransaction", () => {
        describe("given the request to the provider succeeds", () => {
            describe("given the transaction is successful or failed", () => {
                it("should return the verifyTransactionDto", async () => {
                    HttpClientInstanceMock.get.mockResolvedValue(sampleTrxRes);
                    const sampleData = sampleTrxRes.data.authorization;
                    const expectedData: VerifyTransactionResponseDto = {
                        status: "successful",
                        accountName: sampleData.account_name,
                        accountNumber: null,
                        bankName: sampleData.bank,
                        cardNumber: `${sampleData.bin}xxx${sampleData.last4}`,
                        cardType: sampleData.brand,
                        channel: "card",
                        provider: "paystack",
                        providerRef: sampleTrxRes.data.id.toString(),
                        reference: sampleTrxRes.data.reference,
                    };

                    const result = await paystackRepo.verifyTransaction(
                        sampleTrxRes.data.reference
                    );
                    expect(result).toEqual(expectedData);
                    expect(HttpClientInstanceMock.get).toHaveBeenCalledTimes(1);
                    expect(HttpClientInstanceMock.get).toHaveBeenCalledWith(
                        `/transaction/verify/${sampleTrxRes.data.reference}`
                    );
                });
            });

            describe("given the transaction is still pending", () => {
                it("should return null", async () => {
                    HttpClientInstanceMock.get.mockResolvedValue({
                        ...sampleTrxRes,
                        data: { ...sampleTrxRes.data, status: "pending" },
                    });
                    const result = await paystackRepo.verifyTransaction(
                        sampleTrxRes.data.reference
                    );
                    expect(result).toBeNull();
                });
            });
        });

        describe("given the request to the provider fails", () => {
            it("should return null and log the error to console and an external service", async () => {
                const err = new HttpError({ message: "work" });
                HttpClientInstanceMock.get.mockRejectedValue(err);
                logErrorMock.mockImplementation(async (args) => {});
                const retValue = await paystackRepo.verifyTransaction("reference");
                expect(retValue).toBeNull();
                expect(logErrorMock).toHaveBeenCalledTimes(1);
                expect(logErrorMock).toHaveBeenCalledWith({
                    error: err,
                    message: "Error verifying transaction from paystack: " + err.message,
                    channels: ["console", "external"],
                });
            });
        });
    });
});
