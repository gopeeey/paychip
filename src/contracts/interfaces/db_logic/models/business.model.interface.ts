export interface BusinessModelInterface {
    id: number;
    ownerId: string;
    name: string;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
