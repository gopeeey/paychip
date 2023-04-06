import { AccountModelInterface } from "@logic/account";
import { SessionInterface } from "@logic/session_interface";
import { CreateBusinessDto } from "../dtos";
import { BusinessModelInterface } from "./business.model.interface";

export interface BusinessRepoInterface {
    create: (
        createBusinessDto: CreateBusinessDto,
        session?: SessionInterface
    ) => Promise<BusinessModelInterface>;

    findById: (id: BusinessModelInterface["id"]) => Promise<BusinessModelInterface | null>;

    getOwnerBusinesses: (ownerId: AccountModelInterface["id"]) => Promise<BusinessModelInterface[]>;

    getFullBusiness: (id: BusinessModelInterface["id"]) => Promise<BusinessModelInterface | null>;
}
