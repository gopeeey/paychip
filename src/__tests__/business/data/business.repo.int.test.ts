import { BusinessRepo } from "@business/data";
import { PgSession, runQuery } from "@db/postgres";
import { BusinessModelInterface, CreateBusinessDto } from "@business/logic";
import SQL from "sql-template-strings";
import {
    businessSeeder,
    getABusiness,
    getACountry,
    getAnAccount,
} from "src/__tests__/helpers/samples";
import { DBSetup } from "src/__tests__/helpers/test_utils";

const pool = DBSetup(businessSeeder);

const businessRepo = new BusinessRepo(pool);

describe("TESTING BUSINESS REPO", () => {
    describe("Testing create", () => {
        it("should return business object", async () => {
            const owner = await getAnAccount(pool);
            const country = await getACountry(pool);
            const data: CreateBusinessDto = {
                countryCode: country.isoCode,
                name: "The business",
                ownerId: owner.id,
            };
            const client = await pool.connect();
            const session = await PgSession.start(client);
            const business = await businessRepo.create(data, session);
            await session.commit();
            await session.end();
            if (!business) throw new Error("Failed to persist business");
            const res = await runQuery<BusinessModelInterface>(
                SQL`SELECT * FROM businesses WHERE id = ${business.id}`,
                pool
            );
            const persisted = res.rows[0];
            expect(business).toMatchObject(persisted);
        });
    });

    describe("Testing findById method", () => {
        describe("Given the business exists", () => {
            it("should return an business object", async () => {
                const existing = await getABusiness(pool);
                const result = await businessRepo.findById(existing.id);
                if (!result) throw new Error("Business not found");
                expect(result).toMatchObject(existing);
            });
        });

        describe("Given the business does not exist", () => {
            it("should return null", async () => {
                const result = await businessRepo.findById(5555);
                expect(result).toBe(null);
            });
        });
    });

    describe("Testing getOwnerBusinesses", () => {
        describe("Given the owner has businesses", () => {
            it("should return an array of the owner's businesses", async () => {
                const existing = await getABusiness(pool);
                const result = await businessRepo.getOwnerBusinesses(existing.ownerId);
                result.forEach((business) => {
                    expect(business.ownerId).toBe(existing.ownerId);
                });
                const existingMatch = result.find((busi) => busi.id === existing.id);
                if (!existingMatch) throw new Error("Existing business not included in result");
                expect(existing).toMatchObject(existingMatch);
            });
        });

        describe("Given the owner has no businesses", () => {
            it("should return an empty array", async () => {
                const result = await businessRepo.getOwnerBusinesses(
                    "84322fbb-95e3-4b92-8e69-66fccb020b07"
                );
                expect(result).toEqual([]);
            });
        });
    });

    // describe("Testing getFullBusiness", () => {
    //     describe("Given the business exists", () => {
    //         it("should return a business json object", async () => {
    //             const existing = await Business.findOne({ include: "currencies" });
    //             if (!existing) throw new SeedingError("business not found");

    //             const business = await businessRepo.getFullBusiness(existing.id);
    //             if (!business) throw new Error("Business not found");
    //             expect(existing).toMatchObject(business);
    //         });
    //     });

    //     describe("Given the business does not exist", () => {
    //         it("should return null", async () => {
    //             const business = await businessRepo.getFullBusiness(7777);
    //             expect(business).toBe(null);
    //         });
    //     });
    // });
});
