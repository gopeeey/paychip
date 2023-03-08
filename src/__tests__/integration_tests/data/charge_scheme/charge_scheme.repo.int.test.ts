import { Business } from "@data/business";
import { ChargeScheme, ChargeSchemeRepo } from "@data/charge_scheme";
import { Country } from "@data/country";
import { CreateChargeSchemeDto } from "@logic/charge_scheme";
import { chargeSchemeData, chargeSchemeSeeder } from "src/__tests__/samples";
import { DBSetup, SeedingError } from "src/__tests__/test_utils";

const chargeSchemeRepo = new ChargeSchemeRepo(ChargeScheme);

DBSetup(chargeSchemeSeeder);

describe("TESTING CHARGE SCHEME REPO", () => {
    describe("Testing create", () => {
        it("should return a charge scheme object", async () => {
            const business = await Business.findOne();
            if (!business) throw new SeedingError("business not found");
            const country = await Country.findByPk(business.countryCode);
            if (!country) throw new SeedingError("country not found");

            const data: CreateChargeSchemeDto = {
                ...chargeSchemeData.senderFunding,
                businessId: business.id,
                currency: country.currencyCode,
            };
            const chargeScheme = await chargeSchemeRepo.create(data);
            expect(chargeScheme.id).toBeDefined();

            const persisted = await ChargeScheme.findByPk(chargeScheme.id);
            if (!persisted) throw new Error("Charge scheme not persisted");
            expect(persisted.businessId).toBe(data.businessId);
            expect(persisted.currency).toBe(data.currency);
            expect(persisted.flatCharge == data.flatCharge).toBe(true);
            expect(persisted.minimumPrincipalAmount == data.minimumPrincipalAmount).toBe(true);
            expect(persisted.payer).toBe(data.payer);
            expect(persisted.percentageCharge == data.percentageCharge).toBe(true);
            expect(persisted.percentageChargeCap == data.percentageChargeCap).toBe(true);
            expect(persisted.transactionType).toBe(data.transactionType);
        });
    });

    describe("Testing getById", () => {
        describe("Given the chargeScheme exists", () => {
            it("should return a charge scheme json object", async () => {
                const existing = await ChargeScheme.findOne();
                if (!existing) throw new SeedingError("charge schemem not found");

                const chargeScheme = await chargeSchemeRepo.getById(existing.id);
                if (!chargeScheme) throw new Error("Charge scheme not persisted");
                expect(chargeScheme.businessId).toBe(existing.businessId);
                expect(chargeScheme.currency).toBe(existing.currency);
                expect(chargeScheme.flatCharge == existing.flatCharge).toBe(true);
                expect(chargeScheme.minimumPrincipalAmount == existing.minimumPrincipalAmount).toBe(
                    true
                );
                expect(chargeScheme.payer).toBe(existing.payer);
                expect(chargeScheme.percentageCharge == existing.percentageCharge).toBe(true);
                expect(chargeScheme.percentageChargeCap == existing.percentageChargeCap).toBe(true);
                expect(chargeScheme.transactionType).toBe(existing.transactionType);
            });
        });

        describe("Given the chargeScheme does not exist", () => {
            it("should return null", async () => {
                const chargeScheme = await chargeSchemeRepo.getById("I see fire");
                expect(chargeScheme).toBeNull();
            });
        });
    });
});
