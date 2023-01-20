export interface BusinessModelInterface {
    id: number;
    ownerId: string;
    name: string;
    countryCode: string;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
