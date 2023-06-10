import { PaystackRepo } from "@data/payment_providers";
import { GeneratePaymentLinkDto, GeneratePaymentLinkError } from "@logic/payment_providers";
import { HttpClientInstanceMock } from "src/__tests__/mocks";
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
});
