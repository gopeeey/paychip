import { ChargesRepo } from "@data/charges";
import {
    CalculateTransactionChargesDto,
    ChargeDto,
    ChargeStackDto,
    ChargesCalculationResultDto,
} from "@logic/charges";
import {
    ChargesService,
    ChargesServiceDependencies,
    AddChargeStackToWalletDto,
} from "@logic/charges";
import { Pool } from "pg";
import { createSpies, sessionMock } from "src/__tests__/mocks";
import { chargeStackData, chargeStackJson, walletJson } from "src/__tests__/samples";

const repo = new ChargesRepo({} as Pool);
const repoSpies = createSpies(repo);

const chargesService = new ChargesService({
    repo: repoSpies,
} as unknown as ChargesServiceDependencies);

describe("TESTING CHARGES SERVICE", () => {
    describe(">>> createStack", () => {
        it("should return a charge stack object", async () => {
            repoSpies.createChargeStack.mockResolvedValue(chargeStackJson.customer);
            const chargeStack = await chargesService.createStack(
                chargeStackData.customer,
                sessionMock
            );
            expect(chargeStack).toEqual(chargeStackJson.customer);
            expect(repoSpies.createChargeStack).toHaveBeenCalledTimes(1);
            expect(repoSpies.createChargeStack).toHaveBeenCalledWith(
                chargeStackData.customer,
                sessionMock
            );
        });
    });

    describe(">>> addStackToWallet", () => {
        it("should call the appropriate method in the repo", async () => {
            repoSpies.addStackToWallet.mockImplementation(async () => {});
            const data = new AddChargeStackToWalletDto({
                chargeStackId: chargeStackJson.wallet.id,
                walletId: walletJson.id,
                chargeType: "funding",
            });
            await chargesService.addStackToWallet(data);
            expect(repoSpies.addStackToWallet).toHaveBeenCalledTimes(1);
            expect(repoSpies.addStackToWallet).toHaveBeenCalledWith(data);
        });
    });

    describe(">>> getCompatibleCharge", () => {
        const charges: ChargeDto[] = [
            {
                flatCharge: 0,
                minimumPrincipalAmount: 4000,
                percentageCharge: 20,
                percentageChargeCap: 3000,
            },
            {
                flatCharge: 0,
                minimumPrincipalAmount: 7000,
                percentageCharge: 20,
                percentageChargeCap: 3000,
            },
            {
                flatCharge: 0,
                minimumPrincipalAmount: 11000,
                percentageCharge: 20,
                percentageChargeCap: 3000,
            },
        ];

        describe("given no charge with minimumPrincipalAmount less than the amount is present in the stack", () => {
            it("should return null", () => {
                const amount = 2000;
                const charge = chargesService.getCompatibleCharge(amount, charges);
                expect(charge).toBeNull();
            });
        });

        describe("given the minimumPrincipalAmount requirement is met by several charges", () => {
            it("should return the charge with the minimumPrincipalAmount closest and less than the amount", () => {
                const amount = 8000;
                const charge = chargesService.getCompatibleCharge(amount, charges);
                expect(charge).toEqual(charges[1]);
            });
        });
    });

    describe(">>> calculateCharge", () => {
        it("should return the correct charge and got values", () => {
            const charges = [
                new ChargeDto({
                    flatCharge: 20,
                    percentageCharge: 20,
                    minimumPrincipalAmount: 400,
                    percentageChargeCap: 5000,
                }),
                new ChargeDto({
                    flatCharge: 0,
                    percentageCharge: 50,
                    minimumPrincipalAmount: 400,
                    percentageChargeCap: 500,
                }),
                new ChargeDto({
                    flatCharge: 200,
                    percentageCharge: 10,
                    minimumPrincipalAmount: 400,
                    percentageChargeCap: 500,
                }),
            ];

            const amounts = [
                {
                    amount: 2000,
                    expected: [420, 500, 400],
                },
                {
                    amount: 5000,
                    expected: [1020, 500, 700],
                },
            ];

            for (const amount of amounts) {
                for (let i = 0; i < charges.length; i++) {
                    const charge = charges[i];
                    const result = chargesService.calculateCharge(amount.amount, charge);
                    expect(result).toBe(amount.expected[i]);
                }
            }
        });
    });

    describe(">>> calculateTransactionCharges", () => {
        it("should return the expected results", () => {
            const businessCharges: ChargeDto[] = [
                {
                    flatCharge: 200,
                    minimumPrincipalAmount: 2000,
                    percentageCharge: 10,
                    percentageChargeCap: 500,
                },
                {
                    flatCharge: 100,
                    minimumPrincipalAmount: 4000,
                    percentageCharge: 15,
                    percentageChargeCap: 600,
                },
                {
                    flatCharge: 300,
                    minimumPrincipalAmount: 7000,
                    percentageCharge: 12,
                    percentageChargeCap: 470,
                },
            ];
            const platformCharges: ChargeDto[] = [
                {
                    flatCharge: 0,
                    minimumPrincipalAmount: 1000,
                    percentageCharge: 10,
                    percentageChargeCap: 500,
                },
                {
                    flatCharge: 100,
                    minimumPrincipalAmount: 5000,
                    percentageCharge: 10,
                    percentageChargeCap: 700,
                },
                {
                    flatCharge: 50,
                    minimumPrincipalAmount: 7000,
                    percentageCharge: 15,
                    percentageChargeCap: 700,
                },
            ];

            const dataSet: CalculateTransactionChargesDto[] = [
                {
                    amount: 5000,
                    businessChargesPaidBy: "wallet",
                    businessChargeStack: businessCharges,
                    customWalletChargeStack: null,
                    platformChargesPaidBy: "wallet",
                    platformChargeStack: platformCharges,
                    transactionType: "credit",
                    waiveBusinessCharges: false,
                },
                {
                    amount: 2000,
                    businessChargesPaidBy: "customer",
                    businessChargeStack: businessCharges,
                    customWalletChargeStack: null,
                    platformChargesPaidBy: "wallet",
                    platformChargeStack: platformCharges,
                    transactionType: "credit",
                    waiveBusinessCharges: false,
                },
                {
                    amount: 8000,
                    businessChargesPaidBy: "wallet",
                    businessChargeStack: businessCharges,
                    customWalletChargeStack: null,
                    platformChargesPaidBy: "customer",
                    platformChargeStack: platformCharges,
                    transactionType: "credit",
                    waiveBusinessCharges: false,
                },
                {
                    amount: 5000,
                    businessChargesPaidBy: "wallet",
                    businessChargeStack: businessCharges,
                    customWalletChargeStack: null,
                    platformChargesPaidBy: "wallet",
                    platformChargeStack: platformCharges,
                    transactionType: "debit",
                    waiveBusinessCharges: false,
                },
                {
                    amount: 2000,
                    businessChargesPaidBy: "customer",
                    businessChargeStack: businessCharges,
                    customWalletChargeStack: null,
                    platformChargesPaidBy: "customer",
                    platformChargeStack: platformCharges,
                    transactionType: "debit",
                    waiveBusinessCharges: false,
                },
                {
                    amount: 8000,
                    businessChargesPaidBy: "wallet",
                    businessChargeStack: businessCharges,
                    customWalletChargeStack: null,
                    platformChargesPaidBy: "customer",
                    platformChargeStack: platformCharges,
                    transactionType: "debit",
                    waiveBusinessCharges: false,
                },
            ];

            const expectedResults: ChargesCalculationResultDto[] = [
                {
                    businessCharge: 700,
                    businessGot: 4400,
                    businessPaid: 600,
                    platformCharge: 600,
                    platformGot: 5000,
                    receiverPaid: 700,
                    senderPaid: 5000,
                    settledAmount: 4300,
                    businessChargesPaidBy: "wallet",
                    platformChargesPaidBy: "wallet",
                },
                {
                    businessCharge: 400,
                    businessGot: 2200,
                    businessPaid: 200,
                    platformCharge: 200,
                    platformGot: 2400,
                    receiverPaid: 0,
                    senderPaid: 2400,
                    settledAmount: 2000,
                    businessChargesPaidBy: "customer",
                    platformChargesPaidBy: "wallet",
                },
                {
                    businessCharge: 770,
                    businessGot: 8000,
                    businessPaid: 0,
                    platformCharge: 750,
                    platformGot: 8750,
                    receiverPaid: 770,
                    senderPaid: 8750,
                    settledAmount: 7230,
                    businessChargesPaidBy: "wallet",
                    platformChargesPaidBy: "customer",
                },
                {
                    businessCharge: 700,
                    businessGot: 0,
                    businessPaid: 5600,
                    platformCharge: 600,
                    platformGot: 0,
                    receiverPaid: 0,
                    senderPaid: 5700,
                    settledAmount: 5000,
                    businessChargesPaidBy: "wallet",
                    platformChargesPaidBy: "wallet",
                },
                {
                    businessCharge: 400,
                    businessGot: 0,
                    businessPaid: 1600,
                    platformCharge: 200,
                    platformGot: 0,
                    receiverPaid: 600,
                    senderPaid: 2000,
                    settledAmount: 1400,
                    businessChargesPaidBy: "customer",
                    platformChargesPaidBy: "customer",
                },
                {
                    businessCharge: 770,
                    businessGot: 0,
                    businessPaid: 8000,
                    platformCharge: 750,
                    platformGot: 0,
                    receiverPaid: 750,
                    senderPaid: 8770,
                    settledAmount: 7250,
                    businessChargesPaidBy: "wallet",
                    platformChargesPaidBy: "customer",
                },
            ];

            for (let i = 0; i < dataSet.length; i++) {
                const data = dataSet[i];
                const expected = expectedResults[i];
                const result = chargesService.calculateTransactionCharges(data);
                expect(result).toEqual(expected);
            }
        });
    });

    describe(">>> getWalletChargeStack", () => {
        describe("given the charge stack exists", () => {
            it("should return the charge stack object", async () => {
                repoSpies.getWalletChargeStack.mockResolvedValue(chargeStackJson.customer);
                const chargeStack = await chargesService.getWalletChargeStack(
                    walletJson.id,
                    "funding"
                );
                expect(chargeStack).toEqual(chargeStackJson.customer);
                expect(repoSpies.getWalletChargeStack).toHaveBeenCalledTimes(1);
            });
        });

        describe("given the charge stack does not exist", () => {
            it("should return null", async () => {
                repoSpies.getWalletChargeStack.mockResolvedValue(null);
                const chargeStack = await chargesService.getWalletChargeStack(
                    walletJson.id,
                    "funding"
                );

                expect(chargeStack).toBeNull();
            });
        });
    });
});
