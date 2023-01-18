import AccountRepo from "../../../db/repos/account.repo";
import Account from "../../../db/models/account.model";
import { account, accountData, accountJson } from "../../samples/account.samples";

const createMock = jest.fn();
const findOneMock = jest.fn();
const modelContext = {
    create: createMock,
    findOne: findOneMock,
} as unknown as typeof Account;
const accountRepo = new AccountRepo(modelContext);

describe("Testing AccountRepo", () => {
    describe("Testing create method", () => {
        it("should return a new account instance", async () => {
            createMock.mockResolvedValue(account);
            const newAccount = await accountRepo.create(accountData);
            expect(newAccount).toEqual(accountJson);
            expect(createMock).toHaveBeenCalledTimes(1);
            expect(createMock).toHaveBeenCalledWith(accountData);
        });
    });

    describe("Testing findByEmail method", () => {
        describe("Given the account exists", () => {
            it("should return an account object", async () => {
                findOneMock.mockResolvedValue(account);
                const response = await accountRepo.findByEmail(accountData.email);
                expect(response).toEqual(accountJson);
                expect(findOneMock).toHaveBeenCalledTimes(1);
            });
        });

        describe("Given the account does not exist", () => {
            it("should return null", async () => {
                findOneMock.mockResolvedValue(null);
                const profile = await accountRepo.findByEmail("somerandomstring");
                expect(findOneMock).toHaveBeenCalledTimes(1);
                expect(profile).toBe(null);
            });
        });
    });
});
