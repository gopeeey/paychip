import { AccountRepo } from "@data/accounts";
import { runQuery } from "@data/db";
import { AccountModelInterface, CreateAccountDto } from "@logic/accounts";
import SQL from "sql-template-strings";
import { accountSeeder, getAnAccount } from "src/__tests__/samples";
import { DBSetup } from "src/__tests__/test_utils";

const pool = DBSetup(accountSeeder);

const accountRepo = new AccountRepo(pool);

describe("Testing AccountRepo", () => {
    describe("Testing create method", () => {
        it("should persist the account in the database", async () => {
            const client = await pool.connect();
            try {
                await client.query("BEGIN");
                const data: CreateAccountDto = {
                    email: "myemail@mail.com",
                    name: "Email owner",
                    password: "emaillpassword",
                };
                const created = await accountRepo.create(data, client);
                await client.query("COMMIT");
                const res = await runQuery<AccountModelInterface>(
                    SQL`SELECT * FROM accounts WHERE email = ${data.email}`,
                    pool
                );
                const account = res.rows[0];
                expect(account).toBeDefined();
                expect(created).toEqual(account);
                expect(account).toMatchObject(data);
            } catch (err) {
                await client.query("ROLLBACK");
                console.log(err);
                throw err;
            }
            client.release();
        });
    });

    describe("Testing findByEmail method", () => {
        describe("Given the account exists", () => {
            it("should return an account object", async () => {
                const sampleAccount = await getAnAccount(pool);
                const account = await accountRepo.findByEmail(sampleAccount.email);
                expect(account).toBeDefined();
                expect(account).not.toBeNull();
                expect(account).toMatchObject(sampleAccount);
            });
        });

        describe("Given the account does not exist", () => {
            it("should return null", async () => {
                const account = await accountRepo.findByEmail("somerandomstring");
                expect(account).toBe(null);
            });
        });
    });

    describe("Testing findById method", () => {
        describe("Given the account exists", () => {
            it("should return an account object", async () => {
                const sampleAccount = await getAnAccount(pool);
                const account = await accountRepo.findById(sampleAccount.id);

                expect(account).toBeDefined();
                expect(account).toMatchObject(sampleAccount);
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
