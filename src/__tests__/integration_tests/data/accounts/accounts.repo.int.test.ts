import { AccountRepo, Account } from "@data/accounts";
import { AccountModelInterface, CreateAccountDto } from "@logic/accounts";
import { QueryResult } from "pg";
import SQL from "sql-template-strings";
import { accountData, accountSeeder } from "src/__tests__/samples";
import { DBSetup } from "src/__tests__/test_utils";

const pool = DBSetup(accountSeeder);

const accountRepo = new AccountRepo(pool);

describe("Testing AccountRepo", () => {
    describe.only("Testing create method", () => {
        it.only("should persist the account in the database", async () => {
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
                const res: QueryResult<AccountModelInterface> = await pool.query(
                    SQL`SELECT * FROM accounts WHERE email = ${data.email}`
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

    // describe("Testing findByEmail method", () => {
    //     describe("Given the account exists", () => {
    //         it("should return an account object", async () => {
    //             const account = await accountRepo.findByEmail(accountData.email);
    //             expect(account).toBeDefined();
    //             expect(account).not.toBeNull();
    //             expect(account?.email).toBe(accountData.email);
    //             expect(account?.id).toBeDefined();
    //         });
    //     });

    //     describe("Given the account does not exist", () => {
    //         it("should return null", async () => {
    //             const profile = await accountRepo.findByEmail("somerandomstring");
    //             expect(profile).toBe(null);
    //         });
    //     });
    // });

    // describe("Testing findById method", () => {
    //     describe("Given the account exists", () => {
    //         it("should return an account object", async () => {
    //             const allAccts = await Account.findAll();
    //             const testAccount = allAccts[0];
    //             const account = await accountRepo.findById(testAccount.id);

    //             expect(account).toBeDefined();
    //             expect(account?.email).toBe(testAccount.email);
    //             expect(account?.id).toBe(testAccount.id);
    //         });
    //     });

    //     describe("Given the account does not exist", () => {
    //         it("should return null", async () => {
    //             const result = await accountRepo.findById("84322fbb-95e3-4b92-8e69-66fccb020b07");
    //             expect(result).toBe(null);
    //         });
    //     });
    // });
});
