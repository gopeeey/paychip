import { ChargeStackCharge } from "@data/index";
import { AddChargeStackToWalletDto, CreateChargeDto } from "@logic/charges";
import { ChargesServiceDependencies } from "@logic/charges/interfaces/service.charges.interface";
import { ChargesService } from "@logic/charges/service.charges";
import { sessionMock } from "src/__tests__/mocks";
import {
    chargeData,
    chargeJson,
    chargeStackData,
    chargeStackJson,
    walletJson,
} from "src/__tests__/samples";

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
            repoMock.createChargeStack.mockResolvedValue(chargeStackJson.receiver);
            const chargeStack = await chargesService.createStack(
                chargeStackData.receiver,
                sessionMock
            );
            expect(chargeStack).toEqual(chargeStackJson.receiver);
            expect(repoMock.createChargeStack).toHaveBeenCalledTimes(1);
            expect(repoMock.createChargeStack).toHaveBeenCalledWith(
                chargeStackData.receiver,
                sessionMock
            );
        });
    });

    describe("Testing addStackToWallet", () => {
        it.only("should call the appropriate method in the repo", async () => {
            const data = new AddChargeStackToWalletDto({
                chargeStackId: chargeStackJson.sender.id,
                walletId: walletJson.id,
                chargeStackType: "funding",
                isChildDefault: false,
            });
            await chargesService.addStackToWallet(data);
            expect(repoMock.addStackToWallet).toHaveBeenCalledTimes(1);
            expect(repoMock.addStackToWallet).toHaveBeenCalledWith(data);
        });
    });

    describe("Testing createCharge", () => {
        it("should create and return a charge object", async () => {
            repoMock.createCharge.mockResolvedValue(chargeJson);
            const charge = await chargesService.createCharge(chargeData);
            expect(charge).toEqual(chargeJson);
            expect(repoMock.createCharge).toHaveBeenCalledTimes(1);
            expect(repoMock.createCharge).toHaveBeenCalledWith(chargeData);
        });
    });

    describe("Testing addChargesToStack", () => {
        it("should call the appropriate methods and return a stack object", async () => {
            repoMock.addChargesToStack.mockResolvedValue(chargeStackJson);
            const data = {
                chargeIds: [chargeJson.id],
                stackId: chargeStackJson.receiver.id,
            };
            const result = await chargesService.addChargesToStack(data);
            expect(result).toEqual(chargeStackJson);
            expect(repoMock.addChargesToStack).toHaveBeenCalledTimes(1);
            expect(repoMock.addChargesToStack).toHaveBeenCalledWith(data);
        });
    });
});
