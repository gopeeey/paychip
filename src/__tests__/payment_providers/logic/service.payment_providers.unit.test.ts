import {
    PaymentProviderService,
    PaymentProviderRepoInterface,
    VerifyTransactionResponseDto,
    BankDetails,
    SendMoneyDto,
    VerifyTransferDto,
    VerifyTransferResponseDto,
} from "@payment_providers/logic";
import { PaymentProviderServiceDependenciesInterface } from "@payment_providers/logic/interfaces/service.payment_provider.interface";

const repoMock: { [key in keyof PaymentProviderRepoInterface]: jest.Mock } = {
    generatePaymentLink: jest.fn(),
    verifyTransaction: jest.fn(),
    verifyBankDetails: jest.fn(),
    sendMoney: jest.fn(),
    verifyTransfer: jest.fn(),
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

    describe(">>> verifyBankDetails", () => {
        const input = new BankDetails({
            accountNumber: "1234567890",
            bankCode: "011",
        });
        const output = new BankDetails({ ...input, accountName: "Bank Customer" });

        it("should call the correct method on the correct repo with the details passed", async () => {
            repoMock.verifyBankDetails.mockResolvedValue(output);
            await service.verifyBankDetails(input);
            expect(repoMock.verifyBankDetails).toHaveBeenCalledTimes(1);
            expect(repoMock.verifyBankDetails).toHaveBeenCalledWith(input);
        });

        it("should return the response from the repo", async () => {
            repoMock.verifyBankDetails.mockResolvedValue(output);
            const result = await service.verifyBankDetails(input);
            expect(result).toEqual(output);
        });
    });

    describe(">>> sendMoney", () => {
        const sendMoneyData = new SendMoneyDto({
            amount: 2000,
            bankDetails: { accountName: "Meep Meep", accountNumber: "1234567890", bankCode: "012" },
            currencyCode: "NGN",
            reference: "reference",
            provider: testProvider,
        });
        const providerRef = "providerRef";

        const mockSuccess = () => repoMock.sendMoney.mockResolvedValue(providerRef);

        it("should call the correct provider's sendMoney function", async () => {
            mockSuccess();
            await service.sendMoney(sendMoneyData);
            expect(repoMock.sendMoney).toHaveBeenCalledTimes(1);
            expect(repoMock.sendMoney).toHaveBeenCalledWith(sendMoneyData);
        });

        it("should return a provider reference", async () => {
            const ref = await service.sendMoney(sendMoneyData);
            expect(ref).toBe(providerRef);
        });
    });

    describe(">>> verifyTransfer", () => {
        const dto = new VerifyTransferDto({
            reference: "reference",
            provider: testProvider,
        });
        const expectedRes = new VerifyTransferResponseDto({
            status: "successful",
            providerRef: "providerRef",
        });

        const mockSuccess = () => repoMock.verifyTransfer.mockResolvedValue(expectedRes);

        it("should call the correct provider's verifyTransfer function", async () => {
            mockSuccess();
            await service.verifyTransfer(dto);
            expect(repoMock.verifyTransfer).toHaveBeenCalledTimes(1);
            expect(repoMock.verifyTransfer).toHaveBeenCalledWith(dto);
        });

        it("should return a VerifyTransferResponseDto", async () => {
            const ref = await service.verifyTransfer(dto);
            expect(ref).toBe(expectedRes);
        });
    });
});
