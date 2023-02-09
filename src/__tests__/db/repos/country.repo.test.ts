import { CountryRepo } from "../../../db/repos";
import { Country } from "../../../db/models";
import {
    countryObj,
    countryJson,
    countryData,
    countryObjArray,
    countryJsonArray,
} from "../../samples";

const modelContext = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
};

const countryRepo = new CountryRepo(modelContext as unknown as typeof Country);

describe("Testing country repo", () => {
    describe("Testing create", () => {
        it("should return a country object", async () => {
            modelContext.create.mockResolvedValue(countryObj);
            const country = await countryRepo.create(countryData);
            expect(country).toEqual(countryJson);
            expect(modelContext.create).toHaveBeenCalledTimes(1);
            expect(modelContext.create).toHaveBeenCalledWith(countryData);
        });
    });

    describe("Testing getByCode", () => {
        describe("Given the country exists in the database", () => {
            it("should return the country object", async () => {
                modelContext.findByPk.mockResolvedValue(countryObj);
                const country = await countryRepo.getByCode(countryJson.isoCode);
                expect(country).toEqual(countryJson);
                expect(modelContext.findByPk).toHaveBeenCalledTimes(1);
                expect(modelContext.findByPk).toHaveBeenCalledWith(countryJson.isoCode, {
                    include: "currency",
                });
            });
        });

        describe("Given the country doesn't exists", () => {
            it("should return null", async () => {
                modelContext.findByPk.mockResolvedValue(null);
                const country = await countryRepo.getByCode(countryData.isoCode);
                expect(country).toBe(null);
                expect(modelContext.findByPk).toHaveBeenCalledTimes(1);
                expect(modelContext.findByPk).toHaveBeenCalledWith(countryJson.isoCode, {
                    include: "currency",
                });
            });
        });
    });

    describe("Testing getAll", () => {
        it("should return an array of supported countries", async () => {
            modelContext.findAll.mockResolvedValue(countryObjArray);
            const countries = await countryRepo.getAll();
            expect(countries).toEqual(countryJsonArray);
            expect(modelContext.findAll).toHaveBeenCalledTimes(1);
        });
    });
});
