import { CountryRepo } from "../../../db/repos";
import { Country } from "../../../db/models";
import {
    countryObj,
    countryJson,
    countryData,
    countryObjArray,
    countryJsonArray,
} from "../../samples";

const createMock = jest.fn();
const findByPkMock = jest.fn();
const findAllMock = jest.fn();

const modelContext = {
    create: createMock,
    findByPk: findByPkMock,
    findAll: findAllMock,
} as unknown as typeof Country;

const countryRepo = new CountryRepo(modelContext);

describe("Testing country repo", () => {
    describe("Testing create", () => {
        it("should return a country object", async () => {
            createMock.mockResolvedValue(countryObj);
            const country = await countryRepo.create(countryData);
            expect(country).toEqual(countryJson);
            expect(createMock).toHaveBeenCalledTimes(1);
            expect(createMock).toHaveBeenCalledWith(countryData);
        });
    });

    describe("Testing getByCode", () => {
        describe("Given the country exists in the database", () => {
            it("should return the country object", async () => {
                findByPkMock.mockResolvedValue(countryObj);
                const country = await countryRepo.getByCode(countryJson.isoCode);
                expect(country).toEqual(countryJson);
                expect(findByPkMock).toHaveBeenCalledTimes(1);
                expect(findByPkMock).toHaveBeenCalledWith(countryJson.isoCode);
            });
        });

        describe("Given the country doesn't exists", () => {
            it("should return null", async () => {
                findByPkMock.mockResolvedValue(null);
                const country = await countryRepo.getByCode(countryData.isoCode);
                expect(country).toBe(null);
                expect(findByPkMock).toHaveBeenCalledTimes(1);
                expect(findByPkMock).toHaveBeenCalledWith(countryData.isoCode);
            });
        });
    });

    describe("Testing getAll", () => {
        it("should return an array of supported countries", async () => {
            findAllMock.mockResolvedValue(countryObjArray);
            const countries = await countryRepo.getAll();
            expect(countries).toEqual(countryJsonArray);
            expect(findAllMock).toHaveBeenCalledTimes(1);
        });
    });
});
