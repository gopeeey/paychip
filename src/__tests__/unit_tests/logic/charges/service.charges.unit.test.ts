import { ChargesServiceDependencies } from "@logic/charges/interfaces/service.charges.interface";
import { ChargesService } from "@logic/charges/service.charges";
import { sessionMock } from "src/__tests__/mocks";
import { chargeStackData, chargeStackJson } from "src/__tests__/samples";

const repoMock = {
    createChargeStack: jest.fn(),
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
});
