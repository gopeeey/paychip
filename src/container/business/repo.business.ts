import { Business } from "../../db/models";
import { BusinessRepo } from "../../db/repos";

export const businessRepo = new BusinessRepo(Business);
