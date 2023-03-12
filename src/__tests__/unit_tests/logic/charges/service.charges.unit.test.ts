import { AddChargeStackToWalletDto } from "@logic/charges";
import { ChargesServiceDependencies } from "@logic/charges/interfaces/service.charges.interface";
import { ChargesService } from "@logic/charges/service.charges";
import { sessionMock } from "src/__tests__/mocks";
import { chargeStackData, chargeStackJson, walletJson } from "src/__tests__/samples";

const repoMock = {
    createChargeStack: jest.fn(),
    addStackToWallet: jest.fn(async () => {}),
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
});
