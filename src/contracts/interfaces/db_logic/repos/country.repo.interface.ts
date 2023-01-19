import { CountryModelInterface } from "../models";

export interface CountryRepoInterface {
    create: (
        doc: Pick<CountryModelInterface, "isoCode" | "name">
    ) => Promise<CountryModelInterface>;

    getByCode: (code: string) => Promise<CountryModelInterface | null>;
}
