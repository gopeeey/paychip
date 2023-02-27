import { BusinessService } from "@logic/business";
import { businessRepo } from "./repo.business";
import { getCountry } from "../country";
import { updateBusinessCurrencies } from "../currency";
import { getAccountById } from "../account";
import { createWallet } from "../wallet";
import { startSession } from "../session";

export const businessService = new BusinessService({
    repo: businessRepo,
    getCountry,
    updateCurrencies: updateBusinessCurrencies,
    getAccount: getAccountById,
    createWallet,
    startSession: startSession,
});

// console.log("\n\n\nFROM BUSINESS SERVICE", getCountry("NGA"));
