import { BusinessWalletRepo } from "@data/business_wallet";
import { BusinessWalletService, CreateBusinessWalletDto } from "@logic/business_wallet";
import { createSpies, sessionMock } from "src/__tests__/mocks";
import { businessJson, bwData, bwJson } from "src/__tests__/samples";

const repo = new BusinessWalletRepo();

const repoSpies = createSpies(repo);

const bwService = new BusinessWalletService({ repo });

describe("TESTING BUSINESS WALLET SERVICE", () => {
    describe("Testing createBusinessWallet", () => {
        it("should call the repo create function", async () => {
            repoSpies.create.mockResolvedValue(bwJson);
            const data = new CreateBusinessWalletDto(bwData);
            await bwService.createBusinessWallet(data, sessionMock);

            expect(repoSpies.create).toHaveBeenCalledTimes(1);
            expect(repoSpies.create).toHaveBeenCalledWith(data, sessionMock);
        });

        it("should return the created business wallet object", async () => {
            repoSpies.create.mockResolvedValue(bwJson);
            const data = new CreateBusinessWalletDto(bwData);
            const bw = await bwService.createBusinessWallet(data, sessionMock);

            expect(bw).toEqual(bwJson);
        });
    });
});
