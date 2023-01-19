export interface CountryModelInterface {
    isoCode: string;
    name: string;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
