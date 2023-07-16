import {
    PaymentProviderService,
    PaymentProviderRepoInterface,
    VerifyTransactionResponseDto,
} from "@third_party/payment_providers/logic";
import { PaymentProviderServiceDependenciesInterface } from "@third_party/payment_providers/logic/interfaces/service.payment_provider.interface";

const repoMock = {
    generatePaymentLink: jest.fn(),
    verifyTransaction: jest.fn(),
};

const deps = { aProvider: repoMock } as unknown as PaymentProviderServiceDependenciesInterface;
const testProvider = "aProvider";

const service = new PaymentProviderService(deps);

describe("Testing PaymentProviderService", () => {
    describe(">>> generatePaymentLink", () => {
        it("should return a payment link (string)", async () => {
            const mockLink = "https://link.com";
            repoMock.generatePaymentLink.mockResolvedValue(mockLink);

            const link = await service.generatePaymentLink({
                allowedChannels: ["bank"],
                amount: 200,
                currency: "NGN",
                reference: "don'tmatter",
                walletId: "itreally",
            });
            expect(link).toBe(mockLink);
        });
    });

    describe(">>> verifyTransaction", () => {
        describe("given the provider returns the transaction", () => {
            it("should return the verifyTransactionDto", async () => {
                const [reference, provider] = ["someref", testProvider];
                const vtDto = new VerifyTransactionResponseDto({
                    accountName: "Sam",
                    accountNumber: "1234567890",
                    bankName: "Peace",
                    cardNumber: "1234567890",
                    cardType: "Visa",
                    channel: "card",
                    provider,
                    providerRef: "sldkjfsld",
                    status: "successful",
                    reference,
                    amount: 5000,
                    walletId: "sdlkfjs",
                    customerFirstName: "Sam",
                    customerLastName: "Person",
                    customerName: "Sam Person",
                    customerPhone: "+1234567890",
                });

                repoMock.verifyTransaction.mockResolvedValue(vtDto);
                const response = await service.verifyTransaction(reference, provider);
                expect(response).toEqual(vtDto);
                expect(repoMock.verifyTransaction).toHaveBeenCalledTimes(1);
                expect(repoMock.verifyTransaction).toHaveBeenCalledWith(reference);
            });
        });

        describe("given the provider returns null", () => {
            it("should return null", async () => {
                repoMock.verifyTransaction.mockResolvedValue(null);
                const response = await service.verifyTransaction("some", testProvider);
                expect(response).toBeNull();
            });
        });
    });
});
