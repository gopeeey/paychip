import { BusinessWalletRepo } from "@data/business_wallet";
import {
    BusinessWalletNotFoundError,
    BusinessWalletService,
    CreateBusinessWalletDto,
} from "@logic/business_wallet";
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

    describe("Testing getBusinessWalletByCurrency", () => {
        describe("given the repo returns a wallet object", () => {
            it("should return the wallet object", async () => {
                repoSpies.getByCurrency.mockResolvedValue(bwJson);
                const data = [1234, "NGN"] as const;
                const bw = await bwService.getBusinessWalletByCurrency(...data);
                expect(bw).toEqual(bwJson);
                expect(repoSpies.getByCurrency).toHaveBeenCalledTimes(1);
                expect(repoSpies.getByCurrency).toHaveBeenCalledWith(...data);
            });
        });

        describe("given the repo returns null", () => {
            it("should throw a BusinessWalletNotFoundError", async () => {
                repoSpies.getByCurrency.mockResolvedValue(null);
                const data = [1234, "NGN"] as const;
                await expect(bwService.getBusinessWalletByCurrency(...data)).rejects.toThrow(
                    new BusinessWalletNotFoundError(data[1])
                );
                expect(repoSpies.getByCurrency).toHaveBeenCalledWith(...data);
            });
        });
    });
});
