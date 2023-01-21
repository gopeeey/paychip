type standardOmits = "updatedAt" | "deletedAt";
export type StandardDtoType<
    ModelInterface,
    prop extends keyof Omit<ModelInterface, standardOmits> = any
> = Omit<ModelInterface, standardOmits | prop>;
