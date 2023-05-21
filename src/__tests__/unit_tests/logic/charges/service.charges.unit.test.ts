import { ChargeDto, ChargeStackDto } from "@logic/charges";
import {
    ChargesService,
    ChargesServiceDependencies,
    AddChargeStackToWalletDto,
} from "@logic/charges";
import { sessionMock } from "src/__tests__/mocks";
import { chargeStackData, chargeStackJson, walletJson } from "src/__tests__/samples";

const repoMock = {
    createChargeStack: jest.fn(),
    addStackToWallet: jest.fn(async () => {}),
    createCharge: jest.fn(),
    addChargesToStack: jest.fn(),
};

const chargesService = new ChargesService({
    repo: repoMock,
} as unknown as ChargesServiceDependencies);

describe("TESTING CHARGES SERVICE", () => {
    describe("Testing createStack", () => {
        it("should return a charge stack object", async () => {
            repoMock.createChargeStack.mockResolvedValue(chargeStackJson.customer);
            const chargeStack = await chargesService.createStack(
                chargeStackData.customer,
                sessionMock
            );
            expect(chargeStack).toEqual(chargeStackJson.customer);
            expect(repoMock.createChargeStack).toHaveBeenCalledTimes(1);
            expect(repoMock.createChargeStack).toHaveBeenCalledWith(
                chargeStackData.customer,
                sessionMock
            );
        });
    });

    describe("Testing addStackToWallet", () => {
        it("should call the appropriate method in the repo", async () => {
            const data = new AddChargeStackToWalletDto({
                chargeStackId: chargeStackJson.wallet.id,
                walletId: walletJson.id,
                chargeType: "funding",
            });
            await chargesService.addStackToWallet(data);
            expect(repoMock.addStackToWallet).toHaveBeenCalledTimes(1);
            expect(repoMock.addStackToWallet).toHaveBeenCalledWith(data);
        });
    });

    describe("Testing getCompatibleCharge", () => {
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

    describe("Testing calculateCharge", () => {
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
});
