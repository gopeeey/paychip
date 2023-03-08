import { Account } from "@data/account";
import { BusinessRepo, Business } from "@data/business";
import { Country } from "@data/country";
import { StartSequelizeSession } from "@data/sequelize_session";
import { CreateBusinessDto } from "@logic/index";
import { businessSeeder } from "src/__tests__/samples";
import { DBSetup, SeedingError } from "src/__tests__/test_utils";

const businessRepo = new BusinessRepo(Business);

DBSetup(businessSeeder);

describe("TESTING BUSINESS REPO", () => {
    describe("Testing create", () => {
        it("should return business object", async () => {
            const session = await StartSequelizeSession();
            const owner = await Account.findOne();
            if (!owner) throw new Error("Seeding error: account not found");
            const country = await Country.findOne();
            if (!country) throw new Error("Seeding error: country not found");
            const data: CreateBusinessDto = {
                countryCode: country.isoCode,
                name: "The business",
                ownerId: owner.id,
            };

            const business = await businessRepo.create(data, session);
            await session.commit();
            expect(business.id).toBeDefined();

            const persistedBusiness = await Business.findByPk(business.id);
            if (!persistedBusiness) throw new Error("Business not persisted");
            expect(persistedBusiness).toMatchObject(data);
        });
    });

    describe("Testing findById method", () => {
        describe("Given the business exists", () => {
            it("should return an business object", async () => {
                const existing = await Business.findOne();
                if (!existing) throw new Error("Seeding error: business not found");
                const result = await businessRepo.findById(existing.id);
                expect(result).not.toBeNull();
                expect(result).toBeDefined();
                if (!result) throw new Error("Business not found");
                expect(existing).toMatchObject(result);
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
            it("should return a business json array", async () => {
                const existing = await Business.findOne({ include: "currencies" });
                if (!existing) throw new SeedingError("business not found");
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

    describe("Testing getFullBusiness", () => {
        describe("Given the business exists", () => {
            it("should return a business json object", async () => {
                const existing = await Business.findOne({ include: "currencies" });
                if (!existing) throw new SeedingError("business not found");

                const business = await businessRepo.getFullBusiness(existing.id);
                if (!business) throw new Error("Business not found");
                expect(existing).toMatchObject(business);
            });
        });

        describe("Given the business does not exist", () => {
            it("should return null", async () => {
                const business = await businessRepo.getFullBusiness(7777);
                expect(business).toBe(null);
            });
        });
    });
});
