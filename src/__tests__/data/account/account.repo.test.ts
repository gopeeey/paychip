import { AccountRepo, Account } from "@data/account";
import { sessionMock } from "src/__tests__/mocks";
import { account, accountData, accountJson } from "../../samples";

const createMock = jest.fn();
const findOneMock = jest.fn();
const findByPkMock = jest.fn();
const modelContext = {
    create: createMock,
    findOne: findOneMock,
    findByPk: findByPkMock,
} as unknown as typeof Account;
const accountRepo = new AccountRepo(modelContext);

describe("Testing AccountRepo", () => {
    describe("Testing create method", () => {
        it("should return a new account instance", async () => {
            createMock.mockResolvedValue(account);
            const newAccount = await accountRepo.create(accountData, sessionMock);
            expect(newAccount).toEqual(accountJson);
            expect(createMock).toHaveBeenCalledTimes(1);
            expect(createMock).toHaveBeenCalledWith(accountData, { transaction: sessionMock });
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

    describe("Testing findById method", () => {
        describe("Given the account exists", () => {
            it("should call the correct method on the model", async () => {
                findByPkMock.mockResolvedValue(account);
                await accountRepo.findById(accountJson.id);
                expect(findByPkMock).toHaveBeenCalledTimes(1);
                expect(findByPkMock).toHaveBeenCalledWith(accountJson.id);
            });

            it("should return an account object", async () => {
                const result = await accountRepo.findById(accountJson.id);
                expect(result).toEqual(accountJson);
            });
        });

        describe("Given the account does not exist", () => {
            it("should return null", async () => {
                findByPkMock.mockResolvedValue(null);
                const result = await accountRepo.findById(accountJson.id);
                expect(result).toBe(null);
            });
        });
    });
});
