import { BusinessModelInterface } from "../models";

export interface BusinessRepoInterface {
    create: (
        doc: Pick<BusinessModelInterface, "name" | "ownerId" | "countryCode">
    ) => Promise<BusinessModelInterface>;
    findById: (id: BusinessModelInterface["id"]) => Promise<BusinessModelInterface | null>;
}
