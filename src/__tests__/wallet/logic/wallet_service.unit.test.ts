import {
    InitializeFundingDto,
    GetUniqueWalletDto,
    WalletCreatorDependencies,
    WalletNotFoundError,
    WalletService,
    WalletServiceDependencies,
    IncrementBalanceDto,
    TransactionResolverDependencies,
    ResolveTransactionDto,
    TransactionResolutionError,
    UpdateTransactionInfoDto,
} from "@wallet/logic";
import * as WalletCreatorModule from "@wallet/logic/creator.wallet";
import * as TransactionResolverModule from "@wallet/logic/transaction_resolver.wallet";
import * as FundingInitializerModule from "@wallet/logic/funding_initializer.wallet";
import {
    businessWalletJson,
    transactionJson,
    walletData,
    walletJson,
} from "src/__tests__/helpers/samples";
import { SpiesObj, createSpies, sessionMock } from "src/__tests__/helpers/mocks";
import { WalletRepo } from "@wallet/data";
import { Pool } from "pg";
import {
    BankDetails,
    SendMoneyDto,
    SendMoneyError,
    VerifyTransactionResponseDto,
    VerifyTransferDto,
    VerifyTransferResponseDto,
} from "@payment_providers/logic";
import { ImdsInterface, InternalError, SessionInterface } from "@bases/logic";
import { TransactionMessageDto } from "@queues/transactions";
import { TransferMessageDto } from "@queues/transfers";
import config from "src/config";

const createFn = jest.fn();
jest.mock("../../../wallet/logic/creator.wallet", () => ({
    WalletCreator: jest.fn(() => ({ create: createFn })),
}));

const execFunder = jest.fn();
jest.mock("../../../wallet/logic/funding_initializer.wallet", () => ({
    FundingInitializer: jest.fn(() => ({ exec: execFunder })),
}));

const execTransactionResolver = jest.fn();
jest.mock("../../../wallet/logic/transaction_resolver.wallet", () => ({
    TransactionResolver: jest.fn(() => ({ exec: execTransactionResolver })),
}));

const WalletCreator =
    WalletCreatorModule.WalletCreator as unknown as jest.Mock<WalletCreatorModule.WalletCreator>;

const FundingInitializer =
    FundingInitializerModule.FundingInitializer as unknown as jest.Mock<FundingInitializerModule.FundingInitializer>;

const TransactionResolver =
    TransactionResolverModule.TransactionResolver as unknown as jest.Mock<TransactionResolverModule.TransactionResolver>;

const walletRepoMock = createSpies(new WalletRepo({} as Pool));
const imdsServiceMock: { [key in keyof ImdsInterface]: jest.Mock } = {
    lock: jest.fn(),
    release: jest.fn(),
};

const deps: { [key in keyof Omit<WalletServiceDependencies, "repo" | "imdsService">]: jest.Mock } =
    {
        getCurrency: jest.fn(),
        getWalletChargeStack: jest.fn(),
        calculateCharges: jest.fn(),
        createTransaction: jest.fn(),
        generatePaymentLink: jest.fn(),
        getOrCreateCustomer: jest.fn(),
        verifyTransactionFromProvider: jest.fn(),
        findTransactionByReference: jest.fn(),
        updateTransactionInfo: jest.fn(),
        updateCustomer: jest.fn(),
        sendEmail: jest.fn(),
        publishTransfer: jest.fn(),
        getTransactionByReference: jest.fn(),
        verifyTransferFromProvider: jest.fn(),
        sendMoney: jest.fn(),
        updateTransactionReference: jest.fn(),
    };

const walletService = new WalletService({
    ...deps,
    repo: walletRepoMock,
    imdsService: imdsServiceMock,
} as unknown as WalletServiceDependencies);

const resolveTransactionSpy = jest.spyOn(walletService, "resolveTransaction");

describe("TESTING WALLET SERVICE", () => {
    describe(">>> createWallet", () => {
        it("should run the wallet creator", async () => {
            createFn.mockResolvedValue(walletJson);
            await walletService.createWallet(walletData, sessionMock);
            expect(WalletCreator).toHaveBeenCalledTimes(1);

            const calledWith: WalletCreatorDependencies = {
                dto: walletData,
                repo: walletRepoMock as unknown as WalletCreatorDependencies["repo"],
                getBusinessWallet:
                    walletService.getBusinessWalletByCurrency as WalletCreatorDependencies["getBusinessWallet"],
                session: sessionMock,
            };
            expect(WalletCreator).toHaveBeenCalledWith(calledWith);
            expect(createFn).toHaveBeenCalledTimes(1);
        });

        it("should return a wallet object", async () => {
            createFn.mockResolvedValue(walletJson);
            const wallet = await walletService.createWallet(walletData);
            expect(wallet).toEqual(walletJson);
        });
    });

    describe(">>> getWalletById", () => {
        describe("given the wallet exists", () => {
            it("should return a wallet object", async () => {
                walletRepoMock.getById.mockResolvedValue(walletJson);
                const id = walletJson.id;
                const wallet = await walletService.getWalletById(id);
                expect(wallet).toBeDefined();
                expect(wallet.id).toBe(id);
                expect(walletRepoMock.getById).toHaveBeenCalledTimes(1);
                expect(walletRepoMock.getById).toHaveBeenCalledWith(id);
            });
        });

        describe("given the wallet does not exist", () => {
            it("should throw a wallet not found error", async () => {
                walletRepoMock.getById.mockResolvedValue(null);
                const id = "someId";
                await expect(async () => walletService.getWalletById(id)).rejects.toThrow(
                    new WalletNotFoundError(id)
                );
            });
        });
    });

    describe(">>> getWalletByIdWithBusinessWallet", () => {
        describe("given the wallet exists", () => {
            it("should return a wallet object", async () => {
                walletRepoMock.getByIdWithBusinessWallet.mockResolvedValue(walletJson);
                const id = walletJson.id;
                const wallet = await walletService.getWalletByIdWithBusinessWallet(id);
                expect(wallet).toBeDefined();
                expect(wallet.id).toBe(id);
                expect(walletRepoMock.getByIdWithBusinessWallet).toHaveBeenCalledTimes(1);
                expect(walletRepoMock.getByIdWithBusinessWallet).toHaveBeenCalledWith(id);
            });
        });

        describe("given the wallet does not exist", () => {
            it("should throw a wallet not found error", async () => {
                walletRepoMock.getByIdWithBusinessWallet.mockResolvedValue(null);
                const id = "someId";
                await expect(async () =>
                    walletService.getWalletByIdWithBusinessWallet(id)
                ).rejects.toThrow(new WalletNotFoundError(id));
            });
        });
    });

    describe(">>> getUniqueWallet", () => {
        describe("given the wallet exists", () => {
            it("should return a wallet object", async () => {
                walletRepoMock.getUnique.mockResolvedValue(walletJson);
                const data = new GetUniqueWalletDto(walletJson);
                const wallet = await walletService.getUniqueWallet(data);
                expect(wallet).toBeDefined();
                expect(wallet.id).toBe(walletJson.id);
                expect(walletRepoMock.getUnique).toHaveBeenCalledTimes(1);
                expect(walletRepoMock.getUnique).toHaveBeenCalledWith(data);
            });
        });

        describe("given the wallet does not exist", () => {
            it("should throw a wallet not found error", async () => {
                walletRepoMock.getUnique.mockResolvedValue(null);
                const data: GetUniqueWalletDto = {
                    businessId: 1,
                    email: "not@found.com",
                    currency: "NGN",
                };
                await expect(async () => walletService.getUniqueWallet(data)).rejects.toThrow(
                    new WalletNotFoundError(data)
                );
            });
        });
    });

    describe(">>> initializeFunding", () => {
        it("should return a link", async () => {
            const expectedLink = "https://example.com";
            execFunder.mockResolvedValue(expectedLink);
            const fundingDto: InitializeFundingDto = {
                amount: 300,
                businessId: 2,
                callbackUrl: "https://eg.com",
                currency: "NGN",
                email: "example@test.com",
                walletId: "walletId",
            };
            const link = await walletService.initializeFunding(fundingDto);

            expect(link).toBe(expectedLink);
            expect(FundingInitializer).toHaveBeenCalledTimes(1);
            expect(execFunder).toHaveBeenCalledTimes(1);
        });
    });

    describe(">>> incrementBalance", () => {
        it("should call repo function to increment balance", async () => {
            walletRepoMock.incrementBalance.mockImplementation(async () => {});
            const data = new IncrementBalanceDto({
                walletId: "sokme",
                amount: 400,
                session: sessionMock,
            });
            await walletService.incrementBalance(data);
            expect(walletRepoMock.incrementBalance).toHaveBeenCalledWith(data);
        });
    });

    describe(">>> resolveTransaction", () => {
        it("should instantiate the payment resolver and execute it with the correct data", async () => {
            execTransactionResolver.mockResolvedValue(null);
            const provider = "aProvider";
            const reference = "ref";
            const expectedArgs: TransactionResolverDependencies = {
                calculateCharges: deps.calculateCharges,
                createTransaction: deps.createTransaction,
                findTransactionByReference: deps.findTransactionByReference,
                getBusinessWallet: walletService.getBusinessWalletByCurrency,
                getCurrency: deps.getCurrency,
                getOrCreateCustomer: deps.getOrCreateCustomer,
                getWalletByIdWithBusinessWallet: walletService.getWalletByIdWithBusinessWallet,
                getWalletChargeStack: deps.getWalletChargeStack,
                incrementWalletBalance: walletService.incrementBalance,
                provider,
                reference,
                startSession:
                    walletRepoMock.startSession as unknown as () => Promise<SessionInterface>,
                updateTransactionInfo: deps.updateTransactionInfo,
                verifyTransactionFromProvider: deps.verifyTransactionFromProvider,
                imdsService: imdsServiceMock,
                updateCustomer: deps.updateCustomer,
                sendEmail: deps.sendEmail,
            };
            await walletService.resolveTransaction({ provider, reference });

            expect(TransactionResolver).toHaveBeenCalledTimes(1);
            expect(TransactionResolver).toHaveBeenCalledWith(expectedArgs);
            expect(execTransactionResolver).toHaveBeenCalledTimes(1);
        });
    });

    describe(">>> dequeueTransaction", () => {
        const data = new TransactionMessageDto({
            provider: "provider",
            reference: "reference",
        });

        it("should call the resolveTransaction function on the wallet service", async () => {
            await walletService.dequeueTransaction({ ...data });
            expect(resolveTransactionSpy).toHaveBeenCalledTimes(1);
            expect(resolveTransactionSpy).toHaveBeenCalledWith(new ResolveTransactionDto(data));
        });

        describe("given resolveTransaction throws a critical TransactionResolutionError", () => {
            it("should throw the err", async () => {
                resolveTransactionSpy.mockRejectedValueOnce(
                    new TransactionResolutionError("some", { some: "nights" }, true)
                );
                await expect(() => walletService.dequeueTransaction({ ...data })).rejects.toThrow(
                    TransactionResolutionError
                );
            });
        });

        describe("given resolveTransaction throws a non-critical TransactionResolutionError", () => {
            it("should return", async () => {
                resolveTransactionSpy.mockRejectedValueOnce(
                    new TransactionResolutionError("some", { some: "nights" }, false)
                );
                const val = await walletService.dequeueTransaction({ ...data });
                expect(val).toBeUndefined();
            });
        });

        describe("given resolveTransaction throws a non TransactionResolutionError", () => {
            it("should throw the err", async () => {
                resolveTransactionSpy.mockRejectedValueOnce(new Error("some"));
                await expect(() => walletService.dequeueTransaction({ ...data })).rejects.toThrow(
                    Error
                );
            });
        });
    });

    describe(">>> getBusinessWalletByCurrency", () => {
        describe("given the repo returns a wallet object", () => {
            it("should return the wallet object", async () => {
                walletRepoMock.getBusinessWalletByCurrency.mockResolvedValue(businessWalletJson);
                const data = [1234, "NGN"] as const;
                const bw = await walletService.getBusinessWalletByCurrency(...data);
                expect(bw).toEqual(businessWalletJson);
                expect(walletRepoMock.getBusinessWalletByCurrency).toHaveBeenCalledTimes(1);
                expect(walletRepoMock.getBusinessWalletByCurrency).toHaveBeenCalledWith(...data);
            });
        });

        describe("given the repo returns null", () => {
            it("should throw a BusinessWalletNotFoundError", async () => {
                walletRepoMock.getBusinessWalletByCurrency.mockResolvedValue(null);
                const data = [1234, "NGN"] as const;
                await expect(walletService.getBusinessWalletByCurrency(...data)).rejects.toThrow(
                    new WalletNotFoundError(data[1])
                );
                expect(walletRepoMock.getBusinessWalletByCurrency).toHaveBeenCalledWith(...data);
            });
        });
    });

    describe(">>> dequeueTransfer", () => {
        const { accountNumber, accountName, bankCode } = { ...transactionJson } as const;
        const data = new TransferMessageDto({
            amount: transactionJson.settledAmount,
            bankDetails: new BankDetails({
                accountNumber: accountNumber as string,
                accountName: accountName as string,
                bankCode: bankCode as string,
            }),
            currencyCode: transactionJson.currency,
            provider: transactionJson.provider as string,
            reference: transactionJson.reference,
        });

        const failedReference = transactionJson.reference + config.payment.transferRetrialSuffix;
        const normalProviderRef = "this is the provider ref returned by the send money function";

        const mockAll = () => {
            deps.getTransactionByReference.mockResolvedValue(transactionJson);
            deps.verifyTransferFromProvider.mockResolvedValue(
                new VerifyTransferResponseDto({
                    status: "not_found",
                })
            );
            deps.updateTransactionReference.mockResolvedValue(null);
            deps.updateTransactionReference.mockResolvedValue(null);
            deps.sendMoney.mockResolvedValue(normalProviderRef);
        };
        const providerRef = "this is the provider ref";
        const pendingTransferProviderRes = new VerifyTransferResponseDto({
            status: "pending",
            providerRef,
        });
        const failedTransferProviderRes = new VerifyTransferResponseDto({
            status: "failed",
            providerRef,
        });
        const successfulTransferProviderRef = new VerifyTransferResponseDto({
            status: "successful",
            providerRef,
        });

        it("should fetch the transaction using the getTransactionByReference function", async () => {
            mockAll();
            await walletService.dequeueTransfer(data);
            expect(deps.getTransactionByReference).toHaveBeenCalledTimes(1);
            expect(deps.getTransactionByReference).toHaveBeenCalledWith(data.reference);
        });

        it("should verify the transfer from the provider using the verifyTransferFromProvider function", async () => {
            mockAll();
            await walletService.dequeueTransfer(data);
            expect(deps.verifyTransferFromProvider).toHaveBeenCalledTimes(1);
            expect(deps.verifyTransferFromProvider).toHaveBeenCalledWith(
                new VerifyTransferDto({ reference: data.reference, provider: data.provider })
            );
        });

        describe("given the verifyTransferTransferFromProvider function fails", () => {
            it("should update the providerRef with the retrial providerRef from config", async () => {
                const err = new InternalError("Sorry", {});
                mockAll();
                deps.verifyTransferFromProvider.mockRejectedValue(err);

                await expect(() => walletService.dequeueTransfer(data)).rejects.toThrow(err);
                expect(deps.updateTransactionInfo).toHaveBeenCalledTimes(1);
                expect(deps.updateTransactionInfo).toHaveBeenCalledWith(
                    transactionJson.id,
                    new UpdateTransactionInfoDto({
                        channel: "bank",
                        providerRef: config.payment.retryTempProviderRef,
                        status: "pending",
                    })
                );
            });
        });

        describe("given the status from verification is 'pending'", () => {
            it("should update the transaction providerRef but not call the function to send money", async () => {
                mockAll();
                deps.verifyTransferFromProvider.mockResolvedValue(pendingTransferProviderRes);
                await walletService.dequeueTransfer(data);
                expect(deps.updateTransactionInfo).toHaveBeenCalledTimes(1);
                expect(deps.updateTransactionInfo).toHaveBeenCalledWith(
                    transactionJson.id,
                    new UpdateTransactionInfoDto({
                        channel: "bank",
                        providerRef: pendingTransferProviderRes.providerRef,
                        status: "pending",
                    })
                );
                expect(deps.updateTransactionReference).not.toHaveBeenCalled();
                expect(deps.sendMoney).not.toHaveBeenCalled();
            });
        });

        describe("given the status from verification is 'successful'", () => {
            it("should update the transaction providerRef but not call the function to send money", async () => {
                mockAll();
                deps.verifyTransferFromProvider.mockResolvedValue(successfulTransferProviderRef);
                await walletService.dequeueTransfer(data);
                expect(deps.updateTransactionInfo).toHaveBeenCalledTimes(1);
                expect(deps.updateTransactionInfo).toHaveBeenCalledWith(
                    transactionJson.id,
                    new UpdateTransactionInfoDto({
                        channel: "bank",
                        providerRef: pendingTransferProviderRes.providerRef,
                        status: "pending",
                    })
                );
                expect(deps.sendMoney).not.toHaveBeenCalled();
                expect(deps.updateTransactionReference).not.toHaveBeenCalled();
            });
        });

        describe("given the status from verification is 'failed'", () => {
            it("should update the transaction reference to a new one and call the sendMoney function with the new reference", async () => {
                mockAll();
                deps.verifyTransferFromProvider.mockResolvedValue(failedTransferProviderRes);
                await walletService.dequeueTransfer(data);
                expect(deps.updateTransactionReference).toHaveBeenCalledTimes(1);
                expect(deps.updateTransactionReference).toHaveBeenCalledWith(
                    transactionJson.id,
                    failedReference
                );

                expect(deps.sendMoney).toHaveBeenCalledTimes(1);
                expect(deps.sendMoney).toHaveBeenCalledWith(
                    new SendMoneyDto({
                        amount: data.amount,
                        bankDetails: data.bankDetails,
                        currencyCode: data.currencyCode,
                        provider: data.provider,
                        reference: failedReference,
                    })
                );
            });

            describe("given the sendMoney function succeeds", () => {
                it("should update the providerRef with the one returned from the sendMoney function", async () => {
                    mockAll();
                    deps.verifyTransferFromProvider.mockResolvedValue(failedTransferProviderRes);
                    await walletService.dequeueTransfer(data);
                    expect(deps.updateTransactionInfo).toHaveBeenCalledTimes(1);
                    expect(deps.updateTransactionInfo).toHaveBeenCalledWith(
                        transactionJson.id,
                        new UpdateTransactionInfoDto({
                            channel: "bank",
                            providerRef: normalProviderRef,
                            status: "pending",
                        })
                    );
                });
            });

            describe("given the sendMoney function fails", () => {
                it("should update the providerRef with the retrial providerRef from config", async () => {
                    mockAll();
                    deps.verifyTransferFromProvider.mockResolvedValue(failedTransferProviderRes);
                    deps.sendMoney.mockRejectedValue(
                        new SendMoneyError(
                            "This failed, sorry",
                            data.provider,
                            new SendMoneyDto({ ...data })
                        )
                    );

                    await expect(() => walletService.dequeueTransfer(data)).rejects.toThrow(
                        SendMoneyError
                    );
                    expect(deps.updateTransactionInfo).toHaveBeenCalledTimes(1);
                    expect(deps.updateTransactionInfo).toHaveBeenCalledWith(
                        transactionJson.id,
                        new UpdateTransactionInfoDto({
                            channel: "bank",
                            providerRef: config.payment.retryTempProviderRef,
                            status: "pending",
                        })
                    );
                });
            });
        });

        describe("given the status from verification is 'not_found'", () => {
            it("should call the sendMoney function with the reference provided in the dequeued data", async () => {
                mockAll();

                await walletService.dequeueTransfer(data);
                expect(deps.updateTransactionReference).not.toHaveBeenCalled();
                expect(deps.sendMoney).toHaveBeenCalledTimes(1);
                expect(deps.sendMoney).toHaveBeenCalledWith(
                    new SendMoneyDto({
                        amount: data.amount,
                        bankDetails: data.bankDetails,
                        currencyCode: data.currencyCode,
                        provider: data.provider,
                        reference: data.reference,
                    })
                );
            });

            describe("given the sendMoney function succeeds", () => {
                it("should update the providerRef with the one returned from the sendMoney function", async () => {
                    mockAll();

                    await walletService.dequeueTransfer(data);
                    expect(deps.updateTransactionInfo).toHaveBeenCalledTimes(1);
                    expect(deps.updateTransactionInfo).toHaveBeenCalledWith(
                        transactionJson.id,
                        new UpdateTransactionInfoDto({
                            channel: "bank",
                            providerRef: normalProviderRef,
                            status: "pending",
                        })
                    );
                });
            });

            describe("given the sendMoney function fails", () => {
                it("should update the providerRef with the retrial providerRef from config", async () => {
                    mockAll();
                    deps.sendMoney.mockRejectedValue(
                        new SendMoneyError(
                            "This failed, sorry",
                            data.provider,
                            new SendMoneyDto({ ...data })
                        )
                    );

                    await expect(() => walletService.dequeueTransfer(data)).rejects.toThrow(
                        SendMoneyError
                    );
                    expect(deps.updateTransactionInfo).toHaveBeenCalledTimes(1);
                    expect(deps.updateTransactionInfo).toHaveBeenCalledWith(
                        transactionJson.id,
                        new UpdateTransactionInfoDto({
                            channel: "bank",
                            providerRef: config.payment.retryTempProviderRef,
                            status: "pending",
                        })
                    );
                });
            });
        });

        //      If status is
        //     * pending: do nothing.
        //     * failed: update the transfer reference and sendMoney with updated reference
        //     * not_found: go ahead and send the money
        //     * successful: do nothing
    });
});
