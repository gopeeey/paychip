import { Business } from "@data/business";
import { BusinessWallet, BusinessWalletRepo } from "@data/business_wallet";
import { Country } from "@data/country";
import { Currency } from "@data/currency";
import { StartSequelizeSession } from "@data/sequelize_session";
import { CreateBusinessWalletDto } from "@logic/business_wallet";
import { businessWalletRepo } from "src/container/business_wallet";
import { createClassSpies } from "src/__tests__/mocks";
import { bwSeeder } from "src/__tests__/samples/business_wallet.samples";
import { DBSetup, SeedingError } from "src/__tests__/test_utils";

const bwRepo = new BusinessWalletRepo();

const bwMock = createClassSpies(BusinessWallet, ["create", "findOne"]);

DBSetup(bwSeeder);

const getBC = async () => {
    const business = await Business.findOne();
    if (!business) throw new SeedingError("business not found");
    const country = await Country.findByPk(business.countryCode);
    if (!country) throw new SeedingError("country not found");
    const currency = await Currency.findByPk(country.currencyCode);
    if (!currency) throw new SeedingError("currency not found");

    return { business, currency };
};

const getBw = async () => {
    const bw = await BusinessWallet.findOne();
    if (!bw) throw new SeedingError("Business wallet not found");
    return bw;
};

describe("TESTING BUSINESS WALLET REPO", () => {
    describe("Testing create", () => {
        it("should create a new business wallet row in the db and return the data", async () => {
            const { business, currency } = await getBC();
            const dto = new CreateBusinessWalletDto({
                businessId: business.id,
                currencyCode: currency.isoCode,
            });
            const session = await StartSequelizeSession();
            const bw = await bwRepo.create(dto, session);
            await session.commit();
            const persistedBw = await BusinessWallet.findByPk(bw.id);
            if (!persistedBw) throw new Error("Failed to persist business");
            expect(persistedBw).toMatchObject(dto);
            expect(persistedBw.id.endsWith(business.id.toString())).toBe(true);
            expect(bwMock.create.mock.calls[1][1]).toEqual({ transaction: session });
        });
    });

    describe("Testing getByCurrency", () => {
        describe("Given the wallet exists", () => {
            it("should return a wallet object", async () => {
                const existing = await getBw();
                const bw = await businessWalletRepo.getByCurrency(
                    existing.businessId,
                    existing.currencyCode
                );
                expect(bw).toMatchObject(existing.toJSON());
            });
        });

        describe("Given the wallet does not exist", () => {
            it("should return null", async () => {
                const bw = await businessWalletRepo.getByCurrency(33333, "GHN");
                expect(bw).toBeNull();
            });
        });
    });
});
