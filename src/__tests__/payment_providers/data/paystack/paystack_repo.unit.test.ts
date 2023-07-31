import { PaystackRepo, TransferRecipient } from "@payment_providers/data";
import {
    BankDetails,
    GeneratePaymentLinkDto,
    GeneratePaymentLinkError,
    InvalidBankDetails,
    SendMoneyDto,
    VerifyTransactionResponseDto,
} from "@payment_providers/logic";
import { HttpClientInstanceMock, logErrorMock } from "src/__tests__/helpers/mocks";
import { HttpError, PostRequestArgsInterface, encodeHex } from "src/utils";
import * as utilFuncs from "src/utils/functions";
import config from "src/config";
import { walletJson } from "src/__tests__/helpers/samples";
import { InternalError } from "@bases/logic";
import { runQuery } from "@db/postgres";
import * as dbModule from "@db/postgres/service";
import { Pool } from "pg";
import * as queries from "@payment_providers/data/paystack/queries";
import { DBSetup, SeedingError } from "src/__tests__/helpers/test_utils";
import SQL from "sql-template-strings";

const runQuerySpy = jest.spyOn(dbModule, "runQuery");

jest.mock("../../../../utils/http_client/client", () => ({
    HttpClient: jest.fn(() => HttpClientInstanceMock),
}));

const testBank = new BankDetails({
    accountNumber: "1234567890",
    bankCode: "012",
});

const testRecipient: TransferRecipient = {
    recipientId: "RCP_uujz8yo39x9thmu",
    accountNumber: testBank.accountNumber,
    bankCode: testBank.bankCode,
    currency: "NGN",
};

const seeder = async (pool: Pool) => {
    await runQuery<TransferRecipient>(queries.createTransferRecipient(testRecipient), pool);
};

const pool = DBSetup(seeder);

const paystackRepo = new PaystackRepo(pool);

const paymentData = new GeneratePaymentLinkDto({
    allowedChannels: ["card"],
    amount: 4000,
    currency: "NGN",
    reference: "sdlkfjs",
    walletId: walletJson.id,
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
            email: encodeHex(walletJson.id) + config.misc.emailSuffix,
            customer_code: "CUS_0c35ys9w8ma5tbr",
            phone: "9012341234",
            metadata: {
                calling_code: "+234",
            },
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

const encodeHexSpy = jest.spyOn(utilFuncs, "encodeHex");
const decodeHexSpy = jest.spyOn(utilFuncs, "decodeHex");

describe("Testing PaystackRepo", () => {
    describe(">>> makeCustomerEmail", () => {
        it("should return an encoded version of the string passed with the email suffix attached", () => {
            const fakeHex = "fish";
            const identifier = "something";
            encodeHexSpy.mockReturnValueOnce(fakeHex);
            const result = paystackRepo.makeCustomerEmail(identifier);
            expect(result).toBe(fakeHex + config.misc.emailSuffix);
            expect(encodeHexSpy).toHaveBeenCalledTimes(1);
            expect(encodeHexSpy).toHaveBeenCalledWith(identifier);
        });
    });

    describe(">>> extractIdentifierFromEmail", () => {
        it("should extract the wallet id from the customer email and decode it", () => {
            const fakeHex = "fish";
            const identifier = "something";
            decodeHexSpy.mockReturnValueOnce(identifier);
            const result = paystackRepo.extractIdentifierFromEmail(
                fakeHex + config.misc.emailSuffix
            );
            expect(result).toBe(identifier);
            expect(decodeHexSpy).toHaveBeenCalledTimes(1);
            expect(decodeHexSpy).toHaveBeenCalledWith(fakeHex);
        });
    });

    describe(">>> convertAmountToPaystack", () => {
        it("should multiply amount by 100", () => {
            const amount = 100;
            const result = paystackRepo.convertAmountToPaystack(amount);
            expect(result).toBe(amount * 100);
        });
    });

    describe(">>> convertAmountToPlatform", () => {
        it("should divide amount by 100", () => {
            const amount = 100;
            const result = paystackRepo.convertAmountToPlatform(amount);
            expect(result).toBe(amount / 100);
        });
    });

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
                        amount: paymentData.amount * 100,
                        email: encodeHex(paymentData.walletId) + config.misc.emailSuffix,
                        currency: paymentData.currency,
                        reference: paymentData.reference,
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
                        walletId: walletJson.id,
                        amount: sampleTrxRes.data.amount / 100,
                        customerName:
                            sampleTrxRes.data.customer.first_name +
                            " " +
                            sampleTrxRes.data.customer.last_name,
                        customerFirstName: sampleTrxRes.data.customer.first_name,
                        customerLastName: sampleTrxRes.data.customer.last_name,
                        customerPhone: sampleTrxRes.data.customer.phone
                            ? `${
                                  sampleTrxRes.data.customer.metadata?.calling_code
                                      ? sampleTrxRes.data.customer.metadata.calling_code
                                      : ""
                              }${sampleTrxRes.data.customer.phone}`
                            : null,
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

    describe(">>> verifyBankDetails", () => {
        const input = new BankDetails({
            accountNumber: "1234567890",
            bankCode: "011",
        });
        const output = new BankDetails({ ...input, accountName: "Bank Customer" });

        const paystackRes = {
            status: true,
            message: "Account number resolved",
            data: {
                account_number: "1234567890",
                account_name: "Bank Customer",
                bank_id: 7,
            },
        };

        const mockSuccess = () => {
            HttpClientInstanceMock.get.mockResolvedValue(paystackRes);
        };

        describe("given the request to the provider succeeds", () => {
            it("should return a bank details object", async () => {
                mockSuccess();
                const details = await paystackRepo.verifyBankDetails(input);
                expect(details).toEqual(output);
                expect(HttpClientInstanceMock.get).toHaveBeenCalledTimes(1);
                expect(HttpClientInstanceMock.get).toHaveBeenCalledWith(
                    `/bank/resolve?account_number=${input.accountNumber}&bank_code=${input.bankCode}`
                );
            });
        });

        describe("given the request to the provider fails with a 422", () => {
            it("should throw an invalid bank details error", async () => {
                const err = new HttpError({
                    message: "Could not resolve account name. Check parameters or try again.",
                    statusCode: 422,
                });
                HttpClientInstanceMock.get.mockRejectedValue(err);
                await expect(() => paystackRepo.verifyBankDetails(input)).rejects.toThrow(
                    InvalidBankDetails
                );
            });
        });

        describe("given the request to the provider fails with any other error code", () => {
            it("should throw an internal error", async () => {
                const err = new HttpError({
                    message: "Gateway Timeout",
                    statusCode: 504,
                });
                HttpClientInstanceMock.get.mockRejectedValue(err);
                await expect(() => paystackRepo.verifyBankDetails(input)).rejects.toThrow(
                    InternalError
                );
            });
        });
    });

    describe(">>> createOrGetTransferRecipient", () => {
        describe("given the transferRecipient already exists", () => {
            it("should return the recipient without calling the endpoint to create a new one", async () => {
                const res = await runQuery<TransferRecipient>(
                    SQL`SELECT * FROM "paystackTransferRecipients" LIMIT 1`,
                    pool
                );

                const existing = res.rows[0];
                if (!existing) throw new SeedingError("paystack transfer recipient not found");

                console.log("\n\n\nSAVED RECIPIENT", existing);
                const recipient = await paystackRepo.getOrCreateTransferRecipient(
                    testBank,
                    testRecipient.currency
                );

                expect(recipient).toEqual(existing);
                expect(HttpClientInstanceMock.post).not.toHaveBeenCalled();
            });
        });

        describe("given the transferRecipient does not already exist", () => {
            const customTestBank = new BankDetails({ ...testBank, accountNumber: "121212121212" });
            const paystackRes = {
                status: true,
                message: "Transfer recipient created successfully",
                data: {
                    active: true,
                    createdAt: "2023-07-25T22:32:20.442Z",
                    currency: "NGN",
                    domain: "test",
                    id: 57558905,
                    integration: 830673,
                    name: "Samuel Gopeh",
                    recipient_code: testRecipient.recipientId,
                    type: "nuban",
                    updatedAt: "2023-07-25T22:32:20.442Z",
                    is_deleted: false,
                    isDeleted: false,
                    details: {
                        authorization_code: null,
                        account_number: customTestBank.accountNumber,
                        account_name: "GOPEH SAMUEL MBANG",
                        bank_code: customTestBank.bankCode,
                        bank_name: "First Bank of Nigeria",
                    },
                },
            };

            const mockSuccess = () => {
                HttpClientInstanceMock.post.mockResolvedValue(paystackRes);
            };
            it("should call the paystack endpoint to create a new transferRecipient with the provided data", async () => {
                mockSuccess();
                const recipient = await paystackRepo.getOrCreateTransferRecipient(
                    customTestBank,
                    testRecipient.currency
                );

                const expectedRecipient: TransferRecipient = {
                    recipientId: paystackRes.data.recipient_code,
                    accountNumber: customTestBank.accountNumber,
                    bankCode: customTestBank.bankCode,
                    currency: paystackRes.data.currency,
                };

                expect(recipient).toEqual(expectedRecipient);
            });

            it("should persist the transferRecipient in the database", async () => {
                mockSuccess();
                runQuerySpy.mockClear();
                await paystackRepo.getOrCreateTransferRecipient(
                    customTestBank,
                    testRecipient.currency
                );
                expect(runQuerySpy).toHaveBeenCalledTimes(2);
                const res = await runQuery<TransferRecipient>(
                    queries.getTransferRecipient(customTestBank),
                    pool
                );
                const recipient = res.rows[0];
                if (!recipient) throw new Error("Failed to save recipient");
                expect(recipient).toEqual({
                    ...testRecipient,
                    accountNumber: customTestBank.accountNumber,
                });
            });
        });
    });

    describe(">>> sendMoney", () => {
        const dto = new SendMoneyDto({
            bankDetails: testBank,
            currencyCode: "NGN",
            reference: "fruit",
            amount: 200,
            provider: "paystack",
        });
        const getOrCreateTransferRecipientSpy = jest.spyOn(
            paystackRepo,
            "getOrCreateTransferRecipient"
        );

        const paystackRes = {
            status: true,
            message: "successful",
            data: {
                integration: 100073,
                domain: "test",
                amount: 20000,
                currency: "NGN",
                source: "balance",
                reason: "Calm down",
                recipient: 28,
                status: "pending",
                transfer_code: "TRF_1ptvuv321ahaa7q",
                id: 14,
                createdAt: "2017-02-03T17:21:54.508Z",
                updatedAt: "2017-02-03T17:21:54.508Z",
            },
        };

        const mockSuccess = () => {
            getOrCreateTransferRecipientSpy.mockResolvedValue(testRecipient);
            HttpClientInstanceMock.post.mockResolvedValue(paystackRes);
        };
        // Get a recipient
        it("should call the getOrCreateTransferRecipient function", async () => {
            mockSuccess();
            await paystackRepo.sendMoney(dto);
            expect(getOrCreateTransferRecipientSpy).toHaveBeenCalledTimes(1);
            expect(getOrCreateTransferRecipientSpy).toHaveBeenCalledWith(
                testBank,
                dto.currencyCode
            );
        });

        // Call the endpoint with the recipient id
        it("should call the correct endpoint with the correct data and return the provider's reference", async () => {
            mockSuccess();
            const providerRef = await paystackRepo.sendMoney(dto);
            expect(HttpClientInstanceMock.post).toHaveBeenCalledTimes(1);
            expect(HttpClientInstanceMock.post).toHaveBeenCalledWith({
                url: "/transfer",
                body: {
                    source: "balance",
                    reason: expect.anything(),
                    amount: dto.amount * 100,
                    recipient: testRecipient.recipientId,
                },
            });
            expect(providerRef).toBe(paystackRes.data.transfer_code);
        });
    });
});
