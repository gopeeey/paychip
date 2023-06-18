import { AccountModelInterface } from "@accounts/logic";
import { SessionInterface } from "@bases/logic";
import { CreateBusinessDto } from "../dtos";
import { BusinessModelInterface } from "./business.model.interface";
import { BaseRepoInterface } from "@base_interfaces/logic/base_repo_interface";

export interface BusinessRepoInterface extends BaseRepoInterface {
    create: (
        createBusinessDto: CreateBusinessDto,
        session?: SessionInterface
    ) => Promise<BusinessModelInterface>;

    findById: (id: BusinessModelInterface["id"]) => Promise<BusinessModelInterface | null>;

    getOwnerBusinesses: (ownerId: AccountModelInterface["id"]) => Promise<BusinessModelInterface[]>;

    // getFullBusiness: (id: BusinessModelInterface["id"]) => Promise<BusinessModelInterface | null>;
}
