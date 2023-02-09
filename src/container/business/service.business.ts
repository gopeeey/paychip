import { BusinessService } from "../../logic/services";
import { businessRepo } from "./repo.business";
import { getCountry } from "../country";
import { updateBusinessCurrencies } from "../currency";

export const businessService = new BusinessService({
    repo: businessRepo,
    getCountry,
    updateCurrencies: updateBusinessCurrencies,
});

// console.log("\n\n\nFROM BUSINESS SERVICE", getCountry("NGA"));
