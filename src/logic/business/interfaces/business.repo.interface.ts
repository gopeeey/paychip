import { AccountModelInterface } from "@logic/accounts";
import { SessionInterface } from "@logic/session_interface";
import { CreateBusinessDto } from "../dtos";
import { BusinessModelInterface } from "./business.model.interface";
import { PoolClient } from "pg";

export interface BusinessRepoInterface {
    create: (
        createBusinessDto: CreateBusinessDto,
        client?: PoolClient
    ) => Promise<BusinessModelInterface>;

    findById: (id: BusinessModelInterface["id"]) => Promise<BusinessModelInterface | null>;

    getOwnerBusinesses: (ownerId: AccountModelInterface["id"]) => Promise<BusinessModelInterface[]>;

    // getFullBusiness: (id: BusinessModelInterface["id"]) => Promise<BusinessModelInterface | null>;
}
