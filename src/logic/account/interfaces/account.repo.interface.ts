import { AccountModelInterface } from "./account.model.interface";

export interface AccountRepoInterface {
    create: (
        doc: Pick<AccountModelInterface, "email" | "password" | "name">
    ) => Promise<AccountModelInterface>;

    findByEmail: (email: string) => Promise<AccountModelInterface | null>;

    findById: (id: AccountModelInterface["id"]) => Promise<AccountModelInterface | null>;
}
