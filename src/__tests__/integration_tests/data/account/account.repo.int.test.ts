import { AccountRepo, Account } from "@data/account";
import { StartSequelizeSession } from "@data/sequelize_session";
import { CreateAccountDto } from "@logic/account";
import { accountData, accountSeeder } from "src/__tests__/samples";
import { DBSetup } from "src/__tests__/test_utils";

const accountRepo = new AccountRepo(Account);

DBSetup(accountSeeder);

describe("Testing AccountRepo", () => {
    describe("Testing create method", () => {
        it("should return a new account instance", async () => {
            const session = await StartSequelizeSession();
            try {
                const createSpy = jest.spyOn(Account, "create");
                const data: CreateAccountDto = {
                    email: "myemail@mail.com",
                    name: "Email owner",
                    password: "emaillpassword",
                };
                const account = await accountRepo.create(data, session);
                await session.commit();
                expect(account).toBeDefined();
                expect(account?.email).toEqual(data.email);
                expect(account?.id).toBeDefined();
                expect(createSpy).toHaveBeenCalledWith(data, { transaction: session });
            } catch (err) {
                await session.rollback();
                console.log(err);
            }
        });
    });

    describe("Testing findByEmail method", () => {
        describe("Given the account exists", () => {
            it("should return an account object", async () => {
                const account = await accountRepo.findByEmail(accountData.email);
                expect(account).toBeDefined();
                expect(account).not.toBeNull();
                expect(account?.email).toBe(accountData.email);
                expect(account?.id).toBeDefined();
            });
        });

        describe("Given the account does not exist", () => {
            it("should return null", async () => {
                const profile = await accountRepo.findByEmail("somerandomstring");
                expect(profile).toBe(null);
            });
        });
    });

    describe("Testing findById method", () => {
        describe("Given the account exists", () => {
            it("should return an account object", async () => {
                const allAccts = await Account.findAll();
                const testAccount = allAccts[0];
                const account = await accountRepo.findById(testAccount.id);

                expect(account).toBeDefined();
                expect(account?.email).toBe(testAccount.email);
                expect(account?.id).toBe(testAccount.id);
            });
        });

        describe("Given the account does not exist", () => {
            it("should return null", async () => {
                const result = await accountRepo.findById("84322fbb-95e3-4b92-8e69-66fccb020b07");
                expect(result).toBe(null);
            });
        });
    });
});
