import { BusinessService } from "@logic/business";
import { businessRepo } from "./repo.business";
import { getCountry } from "../country";
import { getAccountById } from "../accounts";
import { startSession } from "../session";
import { createBusinessWallet } from "../business_wallet";

export const businessService = new BusinessService({
    repo: businessRepo,
    getCountry,
    getAccount: getAccountById,
    createBusinessWallet,
    startSession: startSession,
});

// console.log("\n\n\nFROM BUSINESS SERVICE", getCountry("NGA"));
