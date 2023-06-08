import { PaystackRepo } from "@data/payment_providers";
import { GeneratePaymentLinkDto } from "@logic/payment_providers";
import { HttpClientInstanceMock } from "src/__tests__/mocks";
import { PostRequestArgsInterface } from "src/utils";

jest.mock("../../../../../utils/http_client", () => ({
    HttpClient: jest.fn(() => HttpClientInstanceMock),
}));

const paystackRepo = new PaystackRepo();

describe("Testing PaystackRepo", () => {
    describe(">>> generatePaymentLink", () => {
        it("should return a string gotten from a request to the provider", async () => {
            const expectedUrl = "https://go.com";
            HttpClientInstanceMock.post.mockResolvedValue({
                status: true,
                data: { authorization_url: expectedUrl },
            });

            const paymentData = new GeneratePaymentLinkDto({
                allowedChannels: ["card"],
                amount: 4000,
                currency: "NGN",
                transactionId: "sdlkfjs",
                walletId: "sldkjfsldk",
            });

            const link = await paystackRepo.generatePaymentLink(paymentData);

            const postRequestData: PostRequestArgsInterface = {
                url: "/transaction/initialize",
                body: {
                    amount: paymentData.amount,
                    email: paymentData.walletId + "@denacore.com",
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
});
