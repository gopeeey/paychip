import { UserProfileModelInterface } from "../models";

export interface UserProfileRepoInterface {
    create: (
        doc: Pick<UserProfileModelInterface, "email" | "password" | "name">
    ) => Promise<UserProfileModelInterface>;

    findByEmail: (email: string) => Promise<UserProfileModelInterface | null>;
}
