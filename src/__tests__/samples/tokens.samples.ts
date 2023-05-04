import { generateAuthToken } from "src/utils";
import { accountJson } from "./accounts.samples";
import { businessJson } from "./business.samples";

export const accountLevelToken = `Bearer ${generateAuthToken("account", {
    accountId: accountJson.id,
})}`;
export const businessLevelToken = `Bearer ${generateAuthToken("business", {
    accountId: accountJson.id,
    businessId: businessJson.id,
})}`;
