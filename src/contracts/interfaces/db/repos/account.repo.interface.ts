import { AccountModelInterface } from "../models";

export interface AccountRepoInterface {
    create: (
        doc: Pick<AccountModelInterface, "email" | "password" | "name">
    ) => Promise<AccountModelInterface>;

    findByEmail: (email: string) => Promise<AccountModelInterface | null>;
}
