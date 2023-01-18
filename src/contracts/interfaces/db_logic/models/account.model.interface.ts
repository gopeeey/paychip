export interface AccountModelInterface {
    id: string;
    name: string;
    email: string;
    password: string;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
