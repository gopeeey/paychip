import { WalletRepo } from "@wallet/data";
import {
    InitializeWithdrawalDto,
    WithdrawalInitializer,
    WithdrawalInitializerDependencies,
} from "@wallet/logic";
import { Pool } from "pg";
import { createSpies } from "src/__tests__/helpers/mocks";
import { walletJson } from "src/__tests__/helpers/samples";

const walletRepoMock = createSpies(new WalletRepo({} as Pool));

const dto = new InitializeWithdrawalDto({
    amount: 2000,
    accountNumber: "1234567890",
    bankCode: "056",
    walletId: walletJson.id,
});

const deps: { [key in keyof WithdrawalInitializerDependencies]: jest.Mock } = {
    getWalletByIdWithBusinessWallet: jest.fn(),
};

const withdrawalInitializer = new WithdrawalInitializer(dto, deps);

const testWallet = {
    ...walletJson,
    parentWallet: walletJson,
    businessWalletId: walletJson.id,
};

const mockAll = () => {
    deps.getWalletByIdWithBusinessWallet.mockResolvedValue(testWallet);
};

describe("TESTING WITHDRAWAL INITIALIZER", () => {
    // Fetch wallet with business wallet
    it("should fetch the wallet with it's associated business wallet, if applicable", async () => {
        mockAll();
        await withdrawalInitializer.exec();
        expect(deps.getWalletByIdWithBusinessWallet).toHaveBeenCalledTimes(1);
        expect(deps.getWalletByIdWithBusinessWallet).toHaveBeenCalledWith(walletJson.id);
    });
    // Verify account information
    // Calculate charges
    // Check if wallet balance is sufficient
    // Make call to payment provider for transfer
    // Create transaction
    // Return the transaction
});
