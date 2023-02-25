type standardOmits = "updatedAt" | "deletedAt";
export type StandardDtoType<
    ModelInterface,
    prop extends keyof Omit<ModelInterface, standardOmits> = any
> = Omit<ModelInterface, standardOmits | prop>;

export interface BaseModelInterface {
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
