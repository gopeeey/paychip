import {} from "@logic/charges";
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
});
