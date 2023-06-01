import { PaymentProviderService, PaymentProviderRepoInterface } from "@logic/payment_providers";
import { PaymentProviderServiceDependenciesInterface } from "@logic/payment_providers/interfaces/service.payment_provider.interface";

const repoMock = {
    generatePaymentLink: jest.fn(),
};

const deps = { denacore: repoMock } as unknown as PaymentProviderServiceDependenciesInterface;

const service = new PaymentProviderService(deps);

describe("Testing PaymentProviderService", () => {
    describe("Testing generatePaymentLink", () => {
        it("should return a payment link (string)", async () => {
            const mockLink = "https://link.com";
            repoMock.generatePaymentLink.mockResolvedValue(mockLink);

            const link = await service.generatePaymentLink({
                allowedChannels: ["bank"],
                amount: 200,
                currency: "NGN",
                transactionId: "don'tmatter",
                walletId: "itreally",
            });
            expect(link).toBe(mockLink);
        });
    });
});
